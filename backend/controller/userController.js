import userModel from "../models/userModel.js";

export const getUserData =async(req,res)=>{
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success:false, message:"User not found"});
        }

        return res.json({
            success:true, 
            userData: {
                name: user.FullName,
                phone: user.PhoneNumber,
                email: user.Email,
                role: user.Role,
                participant: user.Participant,   //di dalam sini ada info ttg nama mandarin, dob, gender, address, institution, studentcardphotoURL
                admin: user.Admin,               //di dalam sini ada info ttg compType admin
                isAccountVerified: user.IsAccountVerified,
            }
        })
        

    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
        
    }
}

export const getUserDataFromId = async(req,res) =>{
    try {
        const userId = req.query.userId;  
        const user = await userModel.findById(userId);
        
        return res.json({
            success:true, 
            userData: {
                name: user.FullName,
                phone: user.PhoneNumber,
                email: user.Email,
                role: user.Role,
                participant: user.Participant,   //di dalam sini ada info ttg nama mandarin, dob, gender, address, institution, studentcardphotoURL
                admin: user.Admin,               //di dalam sini ada info ttg compType admin
                isAccountVerified: user.IsAccountVerified,
            }
        })

    } catch (error) {
        console.error("Error fetching competition:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}