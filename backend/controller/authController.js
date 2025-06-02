import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import { sendMail } from '../config/nodemailer.js'
import {EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE} from '../config/emailTemplates.js'

// check whether the text is mandarin
function isMandarin(text) {
    const mandarinRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\u3300-\u33ff\ufe30-\ufe4f\uf900-\ufaff\u3200-\u32ff\u3100-\u312f\u31a0-\u31bf]/;
    return mandarinRegex.test(text);
}
//check whether it is valid email format
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}
//check whether it is valid phone number format
function isValidPhoneNumber(phone) {
    const phonePattern = /^(\+\d{1,3}|0)\d{9,14}$/;
    return phonePattern.test(phone);
}
//check whether it is a valid strong password format
function isValidPassword(password) {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordPattern.test(password);
}

export const register = async (req, res) => {
    const { participantDetails } = req.body;
    if (!participantDetails) {
        return res.status(400).json({ success: false, message: "Please fill all the required fields" });
    }

    // get the details of the registered data and validation
    const { fullName, mandarinName, dob, gender, address, phone, email, institution, password, studentPhotoUrl } = participantDetails;

    if (!fullName || !mandarinName || !dob || !gender || !address || !phone || !institution || !email || !password || !studentPhotoUrl) {
        return res.status(400).json({ success: false, message: "Please fill all the required fields" });
    }

    if (!isMandarin(mandarinName) && mandarinName !== "-") {
        return res.status(400).json({ success: false, message: "Mandarin name must be Chinese characters or '-'" });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (!isValidPhoneNumber(phone)) {
        return res.status(400).json({ success: false, message: "Phone number must be formatted with +62XX or 0XX" });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({ success: false, message: "Password must have at least 8 characters with at least one letter and one number" });
    }

    try {
        // find whether the user already exists or not
        const existingUser = await userModel.findOne({ Email: email });
        if (existingUser && existingUser.IsAccountVerified) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        // if it exists, but still not verified then delete that existing user
        if (existingUser && !existingUser.IsAccountVerified) {
            await userModel.findOneAndDelete({Email: email});
        }

        const hashedPassword = await bcrypt.hash(password, 10); //hash password
        // create the new user
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

        // create the token (expired in 7d)
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"? "None" : "strict", // force explicit
            domain: process.env.NODE_ENV === 'production' ? '.csbihub.id' : undefined,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ success: true, message: "Account created successfully", user });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const login = async(req,res)=>{
    const {email,password} =req.body;
    if(!email || !password){
        return res.status(400).json({success:false, message:"Please fill all the required fields"})
    }

    try {
        // find user with that email
        const user = await userModel.findOne({ Email: email });
        if(!user){ //if user not found
            return res.status(400).json({success:false, message:'Invalid credentials'})
        }

        // compare password 
        const isMatch = await bcrypt.compare(password, user.Password);
        if(!isMatch){
            return res.status(400).json({success:false, message:"Invalid credentials"})
        }

        // create a token 
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"? "None" : "strict", // force explicit
            domain: process.env.NODE_ENV === 'production' ? '.csbihub.id' : undefined,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({success:true, message:"Logged in successfully", userData:user});


    } catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }
}

 
export const logout = async (req, res) => {
    try {
        //remove the token when logout
        res.cookie('token', '', { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
            domain: process.env.NODE_ENV === 'production' ? '.csbihub.id' : undefined,
            expires: new Date(0) // Set expiry to remove the cookie
        });

        return res.status(200).json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};




export const sendVerifyOtp =async(req,res) =>{
    try {
        const {email} = req.body;
        if(!email){
            return res.status(400).json({success:false, message:"Account already verified"});
        }

        // find the existing user
        const user = await userModel.findOne({Email: email});
        if(user.IsAccountVerified){
            return  res.status(400).json({success:false, message:"Account already verified"});
        }

        // generate a random otp
        const otp = String(Math.floor(100000 + Math.random() *900000));
        user.VerifyOtp = otp;
        user.VerifyOtpExpireAt = Date.now() + 15*60*1000; //otp expired in 15mins
        await user.save();

        // send otp through email
        const info = await sendMail(EMAIL_VERIFY_TEMPLATE, 'Account Verification OTP', otp, user.Email);

        return  res.status(200).json({success:true, message:"Verification OTP has been sent"})


    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
    }
}


export const verifyEmail = async(req,res)=>{
    const {email, otp} = req.body;

    if(!otp){
        return res.status(400).json({success:false, message:"Missing details"}) 
    }

    try {
        //find existing user
        const user = await userModel.findOne({Email: email});
        if(!user){
            return res.status(400).json({success:false, message:"User not found"}) 
        }

        if(user.VerifyOtp==='' || user.VerifyOtp !== otp){
            return res.status(200).json({success:false, message:"Invalid OTP"}) 
        }

        if(user.VerifyOtpExpireAt < Date.now()){
            return res.status(400).json({success:false, message:"Expired OTP"}) 
        }

        // set the account to be verified
        user.IsAccountVerified=true;
        user.VerifyOtp='';
        user.VerifyOtpExpireAt=0;
        await user.save();

        // assign token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({success:true, message:'Email Verified Successfully', userData:user})


    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
    }
}


export const isAuthenticated =async(req,res)=>{
    // see whether the user is authenticated or not
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
        // find existing user
        const user = await userModel.findOne({Email: email});
        if(!user){
            return res.status(400).json({success:false, message:"User not found"});
        }
        
        //generate random number as otp
        const otp = String(Math.floor(100000 + Math.random() *900000));
        user.ResetOtp = otp;
        user.ResetOtpExpireAt = Date.now() + 15*60*1000; //otp expires in 15mins
        await user.save();

        //send email to reset otp
        const info = await sendMail(PASSWORD_RESET_TEMPLATE, 'Account Reset OTP', otp, user.Email);

        return res.status(200).json({success:true, message:"Reset OTP has been sent"})

    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
        
    }
}


export const verifyOtpReset = async(req,res)=>{
    const {email, otp} =req.body;

    if(!email || !otp ){
        return res.status(400).json({success:false, message:"Missing details"});
    }

    try {
        // find existing user
        const user = await userModel.findOne({Email: email});
        if(!user){
            return res.status(400).json({success:false, message:"User not found"});
        }

        // if the otp is invalid or expired
        if(user.ResetOtp==='' || user.ResetOtp!==otp){
            return res.status(200).json({success:false, message:"Invalid OTP"}) 
        }
        if(user.ResetOtpExpireAt < Date.now()){
            return res.status(400).json({success:false, message:"Expired OTP"}) 
        }
        
        // the otp is valid
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
        return res.status(400).json({success:false, message:"Missing details"});
    }

    try {
        // find existing user
        const user = await userModel.findOne({Email: email});
        if(!user){
            return res.status(400).json({success:false, message:"User not found"});
        }
        
        if(!isValidPassword(newPassword)){
            return res.status(400).json({ success: false, message: "Password must have at least 8 characters with at least one letter and one number" });
        }
        // hash password and save to database
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.Password=hashedPassword;
        await user.save();
        
        return res.status(200).json({success:true, message:'Password has been reset successfully'})


    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
        
    }
}

export const handleGoogleCallback = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Issue JWT for the authenticated user
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    // store token in cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production"? "None" : "strict", // force explicit
        domain: process.env.NODE_ENV === 'production' ? '.csbihub.id' : undefined,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    const url = (process.env.NODE_ENV === 'development')? process.env.CLIENT_DEVELOPMENT_URL : process.env.CLIENT_PRODUCTION_URL;

    // Redirect to frontend after successful login
    return res.redirect(url + '/authloading');


};