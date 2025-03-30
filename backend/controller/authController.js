import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js'
import {EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE} from '../config/emailTemplates.js'

export const register = async(req,res)=>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({success:false, message:"Please fill all the required fields"})
    }

    try {
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({success:false, message:"User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({name:name, email:email, password:hashedPassword});
        await user.save();
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none':'strict',
            maxAge: 7 *24 *60 *60 *1000
        });

        return res.status(200).json({success:true, message:"Account created successfully"})


    } catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }
}


export const login = async(req,res)=>{
    const {email,password} =req.body;
    if(!email || !password){
        return res.status(400).json({success:false, message:"Please fill all the required fields"})
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({success:false, message:'Invalid credentials'})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({success:false, message:"Invalid credentials"})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none':'strict',
            maxAge: 7 *24 *60 *60 *1000
        });

        return res.status(200).json({success:true, message:"Logged in successfully"});


    } catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }
}

 
export const logout = async(req,res)=>{
    try {
        res.cookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none':'strict',
        })

        return res.status(200).json({success:true, message: "Logged out"});

    } catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }
}


//TODO: PERBAIKI INI 
export const sendVerifyOtp =async(req,res) =>{
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        if(user.isAccountVerified){
            return res.json({success:false, message:"account already verified"});
        }

        const otp = String(Math.floor(100000 + Math.random() *900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 15*60*1000;
        await user.save();

        const mailOptions ={
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account verification OTP',
            // text: `Your OTP is ${otp}. `,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",user.email)
        }
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId)

        return res.status(200).json({success:true, message:"Verification OTP has been sent"})


    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
    }
}


export const verifyEmail = async(req,res)=>{
    const {userId, otp} = req.body;

    if(!userId || !otp){
        return res.status(400).json({success:false, message:"Missing details"}) 
    }

    try {
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success:false, message:"user not found"}) 
        }

        if(user.verifyOtp==='' || user.verifyOtp !== otp){
            return res.json({success:false, message:"invalid otp"}) 
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success:false, message:"expired otp"}) 
        }

        user.isAccountVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpireAt=0;
        
        await user.save();
        return res.json({success:true, message:'email verified successfully'})


    } catch (error) {
        return res.json({success:false, message:error.message}) 
    }
}


export const isAuthenticated =async(req,res)=>{
    try {
        return res.status(200).json({success:true})   
    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
        
    }
}


export const sendResetOtp = async(req,res)=>{
    const {email} =req.body;

    if(!email){
        return res.status(400).json({success:false, message:"Please fill all the required fields"});
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({success:false, message:"User not found"});
        }

        const otp = String(Math.floor(100000 + Math.random() *900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15*60*1000;
        await user.save();

        const mailOptions ={
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Reset OTP',
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",user.email)
        }
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId)

        return res.status(200).json({success:true, message:"reset otp sent to email"})

    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
        
    }
}


export const resetPassword = async(req,res)=>{
    const {email, otp, newPassword} =req.body;

    if(!email || !otp || !newPassword){
        return res.status(400).json({success:false, message:"Missing details"});
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({success:false, message:"User not found"});
        }

        if(user.resetOtp==='' || user.resetOtp!==otp){
            return res.status(400).json({success:false, message:"Invalid OTP"}) 
        }
        if(user.resetOtpExpireAt < Date.now()){
            return res.status(400).json({success:false, message:"Expired OTP"}) 
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password=hashedPassword;
        user.resetOtp='';
        user.resetOtpExpireAt=0;
        
        await user.save();
        return res.status(200).json({success:true, message:'password has been reset successfully'})


    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
        
    }
}