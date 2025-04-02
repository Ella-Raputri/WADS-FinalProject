import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js'
import {EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE} from '../config/emailTemplates.js'

function isMandarin(text) {
    const mandarinRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\u3300-\u33ff\ufe30-\ufe4f\uf900-\ufaff\u3200-\u32ff\u3100-\u312f\u31a0-\u31bf]/;
    return mandarinRegex.test(text);
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function isValidPhoneNumber(phone) {
    const phonePattern = /^(\+\d{1,3}|0)\d{9,14}$/;
    return phonePattern.test(phone);
}

function isValidPassword(password) {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordPattern.test(password);
}

export const register = async (req, res) => {
    const { participantDetails } = req.body;
    if (!participantDetails) {
        return res.json({ success: false, message: "Please fill all the required fields" });
    }
    console.log(participantDetails)

    const { fullName, mandarinName, dob, gender, address, phone, email, institution, password, studentPhotoUrl } = participantDetails;

    if (!fullName || !mandarinName || !dob || !gender || !address || !phone || !institution || !email || !password || !studentPhotoUrl) {
        return res.json({ success: false, message: "Please fill all the required fields" });
    }

    if (!isMandarin(mandarinName) && mandarinName !== "-") {
        return res.json({ success: false, message: "Mandarin name must be Chinese characters or '-'" });
    }

    if (!isValidEmail(email)) {
        return res.json({ success: false, message: "Invalid email format" });
    }

    if (!isValidPhoneNumber(phone)) {
        return res.json({ success: false, message: "Phone number must be formatted with +62XX or 0XX" });
    }

    if (!isValidPassword(password)) {
        return res.json({ success: false, message: "Password must have at least 8 characters with at least one letter and one number" });
    }

    try {
        const existingUser = await userModel.findOne({ Email: email });
        if (existingUser && existingUser.IsAccountVerified) {
            return res.json({ success: false, message: "User already exists" });
        }
        if (existingUser && !existingUser.IsAccountVerified) {
            await userModel.findOneAndDelete({Email: email});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({
            FullName: fullName,
            PhoneNumber: phone,
            Email: email,
            Password: hashedPassword,
            Role: "participant",
            Participant: {
                MandarinName: mandarinName,
                DOB: dob,
                Gender: gender,
                Address: address,
                Institution: institution,
                StudentCardPhoto: studentPhotoUrl
            },
        });

        await user.save();

        return res.json({ success: true, message: "Account created successfully", user });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const login = async(req,res)=>{
    const {email,password} =req.body;
    if(!email || !password){
        return res.json({success:false, message:"Please fill all the required fields"})
    }

    try {
        const user = await userModel.findOne({ Email: email });
        if(!user){
            return res.json({success:false, message:'Invalid credentials'})
        }

        const isMatch = await bcrypt.compare(password, user.Password);
        if(!isMatch){
            return res.json({success:false, message:"Invalid credentials"})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none':'strict',
            maxAge: 7 *24 *60 *60 *1000
        });

        return res.json({success:true, message:"Logged in successfully"});


    } catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }
}

 
export const logout = async (req, res) => {
    try {
        res.cookie('token', '', { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            expires: new Date(0) // Set expiry to remove the cookie
        });

        return res.json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};




export const sendVerifyOtp =async(req,res) =>{
    try {
        const {email} = req.body;
        console.log(email);
        if(!email){
            console.error("email is required");
        }

        const user = await userModel.findOne({Email: email});
        if(user.IsAccountVerified){
            return res.json({success:false, message:"Account already verified"});
        }

        const otp = String(Math.floor(100000 + Math.random() *900000));
        user.VerifyOtp = otp;
        user.VerifyOtpExpireAt = Date.now() + 15*60*1000;
        await user.save();

        const mailOptions ={
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Account verification OTP',
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",user.Email)
        }
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId)

        return res.json({success:true, message:"Verification OTP has been sent"})


    } catch (error) {
        return res.json({success:false, message:error.message}) 
    }
}


export const verifyEmail = async(req,res)=>{
    const {email, otp} = req.body;

    if(!otp){
        return res.json({success:false, message:"Missing details"}) 
    }

    try {
        const user = await userModel.findOne({Email: email});
        if(!user){
            return res.json({success:false, message:"User not found"}) 
        }

        if(user.VerifyOtp==='' || user.VerifyOtp !== otp){
            return res.json({success:false, message:"Invalid OTP"}) 
        }

        if(user.VerifyOtpExpireAt < Date.now()){
            return res.json({success:false, message:"Expired OTP"}) 
        }

        user.IsAccountVerified=true;
        user.VerifyOtp='';
        user.VerifyOtpExpireAt=0;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({success:true, message:'Email Verified Successfully'})


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
        return res.json({success:false, message:"Please fill all the required fields"});
    }

    try {
        const user = await userModel.findOne({Email: email});
        if(!user){
            return res.json({success:false, message:"User not found"});
        }

        const otp = String(Math.floor(100000 + Math.random() *900000));
        user.ResetOtp = otp;
        user.ResetOtpExpireAt = Date.now() + 15*60*1000;
        await user.save();

        const mailOptions ={
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Account Reset OTP',
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",user.Email)
        }
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId)

        return res.json({success:true, message:"Reset OTP has been sent"})

    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
        
    }
}


export const verifyOtpReset = async(req,res)=>{
    const {email, otp} =req.body;

    if(!email || !otp ){
        return res.json({success:false, message:"Missing details"});
    }

    try {
        const user = await userModel.findOne({Email: email});
        if(!user){
            return res.json({success:false, message:"User not found"});
        }

        if(user.ResetOtp==='' || user.ResetOtp!==otp){
            return res.json({success:false, message:"Invalid OTP"}) 
        }
        if(user.ResetOtpExpireAt < Date.now()){
            return res.json({success:false, message:"Expired OTP"}) 
        }
        
        user.ResetOtp='';
        user.ResetOtpExpireAt=0;
        await user.save();

        return res.status(200).json({success:true, message:'OTP is valid'})

    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
        
    }
}


export const resetPassword = async(req,res)=>{
    const {email, newPassword} =req.body;

    if(!email || !newPassword){
        return res.json({success:false, message:"Missing details"});
    }

    try {
        const user = await userModel.findOne({Email: email});
        if(!user){
            return res.json({success:false, message:"User not found"});
        }
        
        if(!isValidPassword(newPassword)){
            return res.json({ success: false, message: "Password must have at least 8 characters with at least one letter and one number" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.Password=hashedPassword;
        await user.save();
        
        return res.json({success:true, message:'Password has been reset successfully'})


    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
        
    }
}