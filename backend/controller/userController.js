import userModel from "../models/userModel.js";

function isMandarin(text) {
    const mandarinRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\u3300-\u33ff\ufe30-\ufe4f\uf900-\ufaff\u3200-\u32ff\u3100-\u312f\u31a0-\u31bf]/;
    return mandarinRegex.test(text);
}

function isValidPhoneNumber(phone) {
    const phonePattern = /^(\+\d{1,3}|0)\d{9,14}$/;
    return phonePattern.test(phone);
}

export const getUserData =async(req,res)=>{
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(400).json({success:false, message:"User not found"});
        }

        return res.status(200).json({
            success:true, 
            userData: {
                name: user.FullName,
                phone: user.PhoneNumber,
                email: user.Email,
                role: user.Role,
                participant: user.Participant,   //di dalam sini ada info ttg nama mandarin, dob, gender, address, institution, studentcardphotoURL
                admin: user.Admin,               //di dalam sini ada info ttg compType admin
                isAccountVerified: user.IsAccountVerified,
                id: user._id
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
        
        return res.status(200).json({
            success:true, 
            userData: {
                name: user.FullName,
                phone: user.PhoneNumber,
                email: user.Email,
                role: user.Role,
                participant: user.Participant,   //di dalam sini ada info ttg nama mandarin, dob, gender, address, institution, studentcardphotoURL
                admin: user.Admin,               //di dalam sini ada info ttg compType admin
                isAccountVerified: user.IsAccountVerified,
                id:user._id
            }
        })

    } catch (error) {
        console.error("Error fetching competition:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const editUserDetails = async(req,res)=>{
    try {
        const {userId, participantDetails} = req.body;

        if (!participantDetails) {
            return res.status(400).json({ success: false, message: "Please fill all the required fields" });
        }

        const { fullName, mandarinName, dob, gender, address, phone, institution, studentPhotoUrl } = participantDetails;
        console.log(participantDetails);

        if (!fullName || !mandarinName || !dob || !gender || !address || !phone || !institution || !studentPhotoUrl) {
            return res.status(400).json({ success: false, message: "Please fill all the required fields" });
        }

        if (!isMandarin(mandarinName) && mandarinName !== "-") {
            return res.status(400).json({ success: false, message: "Mandarin name must be Chinese characters or '-'" });
        }

        if (!isValidPhoneNumber(phone)) {
            return res.status(400).json({ success: false, message: "Phone number must be formatted with +62XX or 0XX" });
        }


        const user = await userModel.findById(userId);
        user.FullName = fullName;
        user.PhoneNumber = phone;

        const participant = {
            MandarinName: mandarinName,
            DOB: dob,
            Gender: gender,
            Address: address,
            Institution: institution,
            StudentCardPhoto: studentPhotoUrl
        };
        user.Participant = participant;
        await user.save();
        return res.status(200).json({success: true})

    } catch (error) {
        console.error("Error edit user details:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}