import competitionRegistrationModel from "../models/competitionRegistrationModel.js";

export const getCompetitionRegistrations = async(req, res) => {
    try{
        const competitions = await competitionRegistrationModel.find({});
        res.status(200).json(competitions);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

export const createCompetitionRegistration = async(req, res) => {
    try{
        const {userId, competitionId} = req.params;
        const {paymentProofUrl, twibbonProofUrl} = req.body;

        const competitionRegistration = await competitionRegistrationModel.find({
            "UserId": userId,
            "CompTypeId": competitionId
        })

        if (competitionRegistration.length > 0) {
            const lastRegisteredCompetition = competitionRegistration[competitionRegistration.length - 1];
            if (lastRegisteredCompetition.Status === "Pending"){
                return res.status(500).json({message: "Previous Request is Still Being Processed!"});
            } else if (lastRegisteredCompetition.Status === "Accepted"){
                return res.status(500).json({message: "You are Already Registered to This Competition!"});
            } 
        }

        const newRegistration = await competitionRegistrationModel.create({
            "UserId": userId,
            "CompTypeId": competitionId,
            "PaymentProof": paymentProofUrl,
            "TwibbonProof": twibbonProofUrl,
            "Status": "Pending"
        })
        res.status(200).json(newRegistration);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

export const deleteCompetitionRegistration = async(req, res) => {
    try{ 
        const {registrationId} = req.params;
        const newRegistration = await competitionRegistrationModel.findByIdAndDelete(registrationId);
        if (!newRegistration){
            return res.status(404).json({message: "Item not found!"});
        }
        res.status(200).json({message: "Registration Successfully Deleted!"});
    }catch(err){
        res.status(500).json({message: err.message});
    }
}