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
                name:user.FullName,
                role:user.Role,
                isAccountVerified: user.IsAccountVerified,
            }
        })
        

    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
        
    }
}