import competitionRegistrationModel from "../models/competitionRegistrationModel.js";
import ticketModel from "../models/ticketModel.js";
import mongoose from "mongoose";

export const getTotalTicketsInWeek = async (req, res) => {
    try {
        const { date, compTypeId } = req.query;

        if (!date) {
            return res.status(400).json({ message: "Date parameter is required" });
        }

        const selectedDate = new Date(date);
        const endDate = new Date(selectedDate);
        endDate.setDate(endDate.getDate() - endDate.getDay() + 6); 
        endDate.setHours(23, 59, 59, 999); 

        const matchCondition = { createdAt: { $lte: endDate } };
        if (compTypeId) {
            if (!mongoose.isValidObjectId(compTypeId)) {
                return res.status(400).json({ message: "Invalid compTypeId format" });
            }
            matchCondition.CompTypeId = new mongoose.Types.ObjectId(compTypeId);
        }

        const result = await ticketModel.aggregate([
            { $match: matchCondition },
            { $count: "totalTickets" }
        ]);
        
        return res.status(200).json({ totalTickets: result.length > 0 ? result[0].totalTickets : 0 });

    } 
    catch (error) {
        console.error("Error fetching tickets:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getTotalParticipants = async (req, res) => {
    try {
        const { date, compTypeId } = req.query;

        if (!date) {
            return res.status(400).json({ message: "Date parameter is required" });
        }

        const selectedDate = new Date(date);
        const endDate = new Date(selectedDate);
        endDate.setDate(endDate.getDate() - endDate.getDay() + 6); 
        endDate.setHours(23, 59, 59, 999); 

        const matchCondition = { createdAt: { $lte: endDate } };
        if (compTypeId) {
            if (!mongoose.isValidObjectId(compTypeId)) {
                return res.status(400).json({ message: "Invalid compTypeId format" });
            }
            matchCondition.CompTypeId = new mongoose.Types.ObjectId(compTypeId);
        }

        const result = await competitionRegistrationModel.aggregate([
            { $match: matchCondition },
            { $count: "totalParticipants" }
        ]);
        
        return res.status(200).json({ totalParticipants: result.length > 0 ? result[0].totalParticipants : 0 });

    } 
    catch (error) {
        console.error("Error fetching participants:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getFirstRespTime = async (req, res) => {
    try {
        const { date, compTypeId } = req.query;
        if (!date) {
            return res.status(400).json({ message: "Date parameter is required" });
        }

        const selectedDate = new Date(date);
        const endDate = new Date(selectedDate);
        endDate.setDate(endDate.getDate() - endDate.getDay() + 6); 
        endDate.setHours(23, 59, 59, 999); 

        const matchCondition = { createdAt: { $lte: endDate } };
        if (compTypeId) {
            if (!mongoose.isValidObjectId(compTypeId)) {
                return res.status(400).json({ message: "Invalid compTypeId format" });
            }
            matchCondition.CompTypeId = new mongoose.Types.ObjectId(compTypeId);
        }
        
        const result = await ticketModel.aggregate([
            { $match: matchCondition },
            {
                $lookup: {
                    from: "adminuserchats",
                    let: { ticketId: "$_id" },
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "SenderId",
                                foreignField: "_id",
                                as: "sender"
                            }
                        },
                        { $unwind: "$sender" },
                        { $match: { "sender.Role": "admin" } },
                        { $sort: { createdAt: 1 } },
                        { $limit: 1 }
                    ],
                    as: "firstResponse"
                }
            },
            {
                $addFields: {
                    firstResponseTime: {
                        $cond: {
                            if: { $gt: [{ $size: "$firstResponse" }, 0] },
                            then: { $arrayElemAt: ["$firstResponse.createdAt", 0] },
                            else: null
                        }
                    },
                    firstRespTime: {
                        $cond: {
                            if: { $gt: [{ $size: "$firstResponse" }, 0] },
                            then: { $subtract: [{ $arrayElemAt: ["$firstResponse.createdAt", 0] }, "$createdAt"] },
                            else: null
                        }
                    }
                }
            },
            { $match: { firstRespTime: { $ne: null, $gt: 0 } } },
            {
                $group: {
                    _id: null,
                    avgFirstRespTime: { $avg: "$firstRespTime" }
                }
            }
        ]);

        return res.status(200).json({
            avgFirstRespTime: result.length > 0 ? (result[0].avgFirstRespTime)/60000 : 0
        });
        
    } 
    catch (error) {
        console.error("Error fetching first response time:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getFullResolveTime = async (req, res) => {
    try {
        const { date, compTypeId } = req.query;
        if (!date) {
            return res.status(400).json({ message: "Date parameter is required" });
        }

        const selectedDate = new Date(date);
        const endDate = new Date(selectedDate);
        endDate.setDate(endDate.getDate() - endDate.getDay() + 6); 
        endDate.setHours(23, 59, 59, 999); 

        const matchCondition = {
            createdAt: { $lte: endDate },
            Status: { $in: ["Resolved", "Closed"] }
        };

        if (compTypeId) {
            if (!mongoose.isValidObjectId(compTypeId)) {
                return res.status(400).json({ message: "Invalid compTypeId format" });
            }
            matchCondition.CompTypeId = new mongoose.Types.ObjectId(compTypeId);
        }

        const result = await ticketModel.aggregate([
            { $match: matchCondition },
            {
                $addFields: {
                    fullResolveTime: { $subtract: ["$updatedAt", "$createdAt"] }
                }
            },
            { $match: { fullResolveTime: { $gte: 0 } } },
            {
                $group: {
                    _id: null,
                    avgFullResolveTime: { $avg: "$fullResolveTime" }
                }
            }
        ]);

        return res.status(200).json({
            avgFullResolveTime: result.length > 0 ? (result[0].avgFullResolveTime)/60000 : 0
        });
        
    } 
    catch (error) {
        console.error("Error fetching first response time:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};