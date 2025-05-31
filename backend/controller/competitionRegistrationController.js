import competitionRegistrationModel from "../models/competitionRegistrationModel.js";
import competitionTypeModel from "../models/competitionTypeModel.js";
import userModel from "../models/userModel.js"

export const getUserRegistrationById = async (req, res) => {
    try {
        const { UserId, CompetitionId } = req.params;

        // get the newest registration of that user on that competition
        const newestRegistration = await competitionRegistrationModel
            .findOne({ UserId, CompTypeId: CompetitionId })
            .sort({ createdAt: -1 }); // Sort by createdAt descending

        if (!newestRegistration) {
            return res.status(404).json({ success: false, message: "No registration found." });
        }

        // Check if all previous registrations are 'Rejected'
        const allRegistrations = await competitionRegistrationModel.find({
            UserId,
            CompTypeId: CompetitionId
        });

        let all_rejected = true;
        for (let i = 0; i < allRegistrations.length; i++) {
            if (allRegistrations[i].Status !== 'Rejected') {
                all_rejected = false;
                break;
            }
        }
        // can resubmit registration if the previous ones are all rejected
        return res.status(200).json({
            success: true,
            canRegister: all_rejected,
            newestRegistration
        });
    } catch (err) {
        res.status(500).json({ success:false, message: err.message });
    }
};


export const getRegisteredCompetitions = async(req, res) => {
    try{
        // get all competitions that are registered by the user
        const {userId} = req.body;
        const competitionRegistrations = await competitionRegistrationModel.find({
            "UserId": userId
        })

        const result = []
        if (competitionRegistrations.length > 0){
            for (let i = 0; i < competitionRegistrations.length; i++){
                // if the competition date is greater than now, insert that into the upcoming competition for that user
                let competition = await competitionTypeModel.findById(competitionRegistrations[i].CompTypeId);
                if (competition.CompetitionDate.EndDate > Date.now()){
                    result.push(competition);
                }
            }
            // sort based on the start date
            result.sort((a, b) => new Date(a.CompetitionDate.StartDate) - new Date(b.CompetitionDate.StartDate));
            return res.status(200).json({success:true, result:result});
        }
        return res.status(200).json({success:true, result: []});
    }catch(err){
        return res.status(500).json({success:false, message: err.message});
    }
}

export const getCompetitionRegistrations = async (req, res) => {
    try {
        const { compTypeId } = req.params;

        // Fetch competition registrations
        const comps = await competitionRegistrationModel.find({ CompTypeId: compTypeId });

        // Map over the results and fetch user details for each registration
        const competitions = await Promise.all(
            comps.map(async (comp) => {
                const userDetails = await userModel.findById(comp.UserId);
                return {
                    ...comp.toObject(), // Convert MongoDB document to plain object
                    userDetails, // Add user details
                };
            })
        );

        res.status(200).json({ success: true, competitions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createCompetitionRegistration = async(req, res) => {
    try{
        const {UserId, CompetitionId, PaymentProofUrl, TwibbonProofUrl} = req.body;
        
        // get the last registration from that user to that competition
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
        // if they havent registered or all rejected before, they can submit the new registration
        const newRegistration = await competitionRegistrationModel.create({
            "UserId": UserId,
            "CompTypeId": CompetitionId,
            "PaymentProof": PaymentProofUrl,
            "TwibbonProof": TwibbonProofUrl,
            "Status": "Pending"
        })
        res.status(200).json({success: true});
    }catch(err){
        res.status(500).json({success:false, message: err.message});
    }
}

export const deleteCompetitionRegistration = async(req, res) => {
    try{ 
        // delete competition registration based on the Id
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

        // find the existing competition registration
        const competitionRegistration = await competitionRegistrationModel.findById(registrationId);
        
        if (!competitionRegistration){
            return res.status(404).json({message: "Registration not found"})
        }
        // if there is no change
        if (competitionRegistration.AdminComment === adminComment && competitionRegistration.Status === status){
            return res.status(500).json({message: "No changes detected. New values must be different from old ones."})
        }
        // update the status and admin comment if changed
        competitionRegistration.AdminComment = adminComment;
        competitionRegistration.Status = status;

        await competitionRegistration.save();
        res.status(200).json({success:true, message: "Changes applied!"})
    } catch (err){
        res.status(500).json({success: false, message: err.message});
    }
}

export const getUpcomingCompetitions = async(req, res) => {
    try{
        // get competitions that are upcoming (not in the past)
        const result = await competitionTypeModel.find({
            "CompetitionDate.FinalDate": {$gt: Date.now()}
        })
        //sort based on start date
        result.sort((a, b) => new Date(a.CompetitionDate.StartDate) - new Date(b.CompetitionDate.StartDate));
        return res.status(200).json(result);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}