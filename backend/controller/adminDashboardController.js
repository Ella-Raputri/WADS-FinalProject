import ticketModel from "../models/ticketModel.js";


export const getTotalTicketsInWeek = async (req, res) => {
    try {
        const { date } = req.query;
        const { compTypeId } = req.body;

        if (!date) {
            return res.status(400).json({ message: "Date parameter is required" });
        }

        const selectedDate = new Date(date);
        const startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0); 
        startDate.setDate(startDate.getDate() - startDate.getDay()); 

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); 
        endDate.setHours(23, 59, 59, 999); 

        const result = await ticketModel.aggregate([
            { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
            { $count: "totalTickets" }
        ]);
        
        return res.status(200).json({ totalTickets: result.length > 0 ? result[0].totalTickets : 0 });

    } catch (error) {
        console.error("Error fetching tickets:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
