import competitionTypeModel from "../models/competitionTypeModel.js";

export const getCompetitionIdByName = async (req, res) => {
    try {
        // get competition Id by competition name
        const compName = req.query.compName;  
        const competition = await competitionTypeModel.findOne({ Name: compName });
        
        return res.status(200).json({
            success: true,
            id: competition._id
        });

    } catch (error) {
        console.error("Error fetching competition:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const getCompetitionDetails = async(req,res) =>{
    try {
        // get competition details based on competition Id
        const compId = req.query.compId;  
        const comp = await competitionTypeModel.findById(compId);
        
        return res.status(200).json({success:true, comp})

    } catch (error) {
        console.error("Error fetching competition:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getAllCompetitions = async(req,res) =>{
    try {
        // get all competitions details 
        const comps = await competitionTypeModel.find({});
        return res.status(200).json({success: true, comps});      

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}