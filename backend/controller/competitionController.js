import competitionTypeModel from "../models/competitionTypeModel.js";

export const getCompetitionIdByName = async (req, res) => {
    try {
        const compName = req.query.compName;  
        console.log("Received compName:", compName);  // Debugging

        const competition = await competitionTypeModel.findOne({ Name: compName });
        
        return res.json({
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
        const compId = req.query.compId;  
        const comp = await competitionTypeModel.findById(compId);
        
        return res.json({success:true, comp})

    } catch (error) {
        console.error("Error fetching competition:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getAllCompetitions = async(req,res) =>{
    try {
        const comps = await competitionTypeModel.find({});
        return res.status(200).json({success: true, comps});      

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}