import competitionRegistrationModel from "../models/competitionRegistrationModel.js";
import competitionTypeModel from "../models/competitionTypeModel.js";

export const getUserRegistrationById = async(req, res) => {
    try{
        const {UserId, CompetitionId} = req.params;
        const competitionRegistration = await competitionRegistrationModel.find({
            "UserId": UserId,
            "CompTypeId": CompetitionId
        })
        res.status(200).json(competitionRegistration);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

export const getRegisteredCompetitions = async(req, res) => {
    try{
        const {UserId} = req.params;
        const competitionRegistrations = await competitionRegistrationModel.find({
            "UserId": UserId
        })

        const result = []
        if (competitionRegistrations.length > 0){
            for (let i = 0; i < competitionRegistrations.length; i++){
                let competition = await competitionTypeModel.findById(competitionRegistrations[i].CompTypeId);
                if (competition.CompetitionDate.EndDate > Date.now()){
                    result.push(competition);
                }
            }
            result.sort((a, b) => new Date(a.CompetitionDate.StartDate) - new Date(b.CompetitionDate.StartDate));
            return res.status(200).json(result);
        } else {
            return res.status(200).json({message: "No Registrations"});
        }
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

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
        const {UserId, CompetitionId, PaymentProofUrl, TwibbonProofUrl} = req.body;

        const competitionRegistration = await competitionRegistrationModel.find({
            "UserId": UserId,
            "CompTypeId": CompetitionId
        })

        if (competitionRegistration.length > 0) {
            const lastRegisteredCompetition = competitionRegistration[competitionRegistration.length - 1];
            if (lastRegisteredCompetition.Status === "Pending"){
                return res.status(200).json({message: "Previous Request is Still Being Processed!"});
            } else if (lastRegisteredCompetition.Status === "Accepted"){
                return res.status(200).json({message: "You are Already Registered to This Competition!"});
            } 
        }

        const newRegistration = await competitionRegistrationModel.create({
            "UserId": UserId,
            "CompTypeId": CompetitionId,
            "PaymentProof": PaymentProofUrl,
            "TwibbonProof": TwibbonProofUrl,
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

export const editCompetitionRegistration = async(req, res) => {
    try{
        const {registrationId} = req.params;
        const {status, adminComment} = req.body;

        const competitionRegistration = await competitionRegistrationModel.findById(registrationId);
        
        if (!competitionRegistration){
            return res.status(404).json({message: "Registration not found"})
        }

        if (competitionRegistration.AdminComment === adminComment && competitionRegistration.Status === status){
            return res.status(500).json({message: "No changes detected. New values must be different from old ones."})
        }

        competitionRegistration.AdminComment = adminComment;
        competitionRegistration.Status = status;

        await competitionRegistration.save();
        res.status(200).json({message: "Changes applied!"})
    } catch (err){
        res.status(500).json({message: err.message});
    }
}

export const getUpcomingCompetitions = async(req, res) => {
    try{
        const result = await competitionTypeModel.find({
            "CompetitionDate.FinalDate": {$gt: Date.now()}
        })
        result.sort((a, b) => new Date(a.CompetitionDate.StartDate) - new Date(b.CompetitionDate.StartDate));
        return res.status(200).json(result);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}