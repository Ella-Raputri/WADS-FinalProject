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

