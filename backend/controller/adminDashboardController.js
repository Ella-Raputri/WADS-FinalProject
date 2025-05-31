import competitionRegistrationModel from "../models/competitionRegistrationModel.js";
import ratingModel from "../models/ratingModel.js";
import ticketModel from "../models/ticketModel.js";
import mongoose from "mongoose";

export const getTotalTicketsInWeek = async (req, res) => {
    try {
        const { date, compTypeId } = req.query;

        if (!date) {
            return res.status(400).json({ message: "Date parameter is required" });
        }

        // set the end date to the saturday 23:59 of that week based on the selected date
        const selectedDate = new Date(date);
        const endDate = new Date(selectedDate);
        endDate.setDate(endDate.getDate() - endDate.getDay() + 6); 
        endDate.setHours(23, 59, 59, 999); 

        // match based on end date and competition type
        const matchCondition = { CreatedAt: { $lte: endDate } };
        if (compTypeId) {
            if (!mongoose.isValidObjectId(compTypeId)) {
                return res.status(400).json({ message: "Invalid compTypeId format" });
            }
            matchCondition.CompTypeId = new mongoose.Types.ObjectId(compTypeId);
        }

        // count total tickets
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

        // set the end date to the saturday 23:59 of that week based on the selected date
        const selectedDate = new Date(date);
        const endDate = new Date(selectedDate);
        endDate.setDate(endDate.getDate() - endDate.getDay() + 6); 
        endDate.setHours(23, 59, 59, 999); 

        // match condition based on enddate and competition type
        const matchCondition = { createdAt: { $lte: endDate } };
        if (compTypeId) {
            if (!mongoose.isValidObjectId(compTypeId)) {
                return res.status(400).json({ message: "Invalid compTypeId format" });
            }
            matchCondition.CompTypeId = new mongoose.Types.ObjectId(compTypeId);
        }

        // count the total participants
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

        // set the end date to the saturday 23:59 of that week based on the selected date
        const selectedDate = new Date(date);
        const endDate = new Date(selectedDate);
        endDate.setDate(endDate.getDate() - endDate.getDay() + 6); 
        endDate.setHours(23, 59, 59, 999); 

        // match the condition based on end date and competition type
        const matchCondition = { CreatedAt: { $lte: endDate } };
        if (compTypeId) {
            if (!mongoose.isValidObjectId(compTypeId)) {
                return res.status(400).json({ message: "Invalid compTypeId format" });
            }
            matchCondition.CompTypeId = new mongoose.Types.ObjectId(compTypeId);
        }
        
        // get first response time by querying the admin user chat and see when is the admin first reply
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
                            then: { $subtract: [{ $arrayElemAt: ["$firstResponse.createdAt", 0] }, "$CreatedAt"] },
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

        // convert the average first response time from ms to minute
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

        // set the end date to the saturday 23:59 of that week based on the selected date
        const selectedDate = new Date(date);
        const endDate = new Date(selectedDate);
        endDate.setDate(endDate.getDate() - endDate.getDay() + 6); 
        endDate.setHours(23, 59, 59, 999); 

        // match the condition to get ticket that is closed or resolved
        const matchCondition = {
            CreatedAt: { $lte: endDate },
            Status: { $in: ["Resolved", "Closed"] }
        };

        if (compTypeId) {
            if (!mongoose.isValidObjectId(compTypeId)) {
                return res.status(400).json({ message: "Invalid compTypeId format" });
            }
            matchCondition.CompTypeId = new mongoose.Types.ObjectId(compTypeId);
        }

        // get the avg dull resolve time by substracting the resolved time and created time
        const result = await ticketModel.aggregate([
            { $match: matchCondition },
            {
                $addFields: {
                    fullResolveTime: { $subtract: ["$BecomeResolvedAt", "$CreatedAt"] }
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

        // convert the full resolve time from ms to minute
        return res.status(200).json({
            avgFullResolveTime: result.length > 0 ? (result[0].avgFullResolveTime)/60000 : 0
        });
        
    } 
    catch (error) {
        console.error("Error fetching first response time:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getReceivedResolvedBar = async (req, res) => {
    try {
        const { date, compTypeId } = req.query;
        if (!date) {
            return res.status(400).json({ message: "Date parameter is required" });
        }

        // set the start week and end week based on GMT+7
        const selectedDate = new Date(date);
        const gmtPlus7Offset = 7 * 60 * 60 * 1000;
        
        const weekStart = new Date(selectedDate);
        weekStart.setDate(selectedDate.getDate() - selectedDate.getDay()); 
        const weekStartUTC = new Date(weekStart.getTime() - gmtPlus7Offset);
        
        const weekEndUTC = new Date(weekStartUTC);
        weekEndUTC.setDate(weekStart.getDate() + 6);
        weekEndUTC.setHours(23, 59, 59, 999);

        // get only data that is in range of week start to week end
        const match = {
            $and: [
                {
                    $or: [
                        { CreatedAt: { $gte: weekStartUTC, $lte: weekEndUTC } },
                        { BecomeResolvedAt: { $gte: weekStartUTC, $lte: weekEndUTC } }
                    ]
                }
            ]
        };

        if (compTypeId) {
            if (!mongoose.isValidObjectId(compTypeId)) {
                return res.status(400).json({ message: "Invalid compTypeId format" });
            }
            match.$and.push({ CompTypeId: new mongoose.Types.ObjectId(compTypeId) });
        }

        // get the chart data
        const initChartData = [];
        for (let i = 0; i < 7; i++) {
            const currentDateUTC = new Date(weekStartUTC);
            currentDateUTC.setDate(weekStartUTC.getDate() + i);
            
            const currentDateGMT7 = new Date(currentDateUTC.getTime() + gmtPlus7Offset);
            const formattedDate = currentDateGMT7.toISOString().split("T")[0].slice(5, 10);
            
            initChartData.push({
                date: formattedDate,
                received: 0,
                resolved: 0
            });
        }

        // count the tickets (received and resolved)
        const tickets = await ticketModel.aggregate([
            { $match: match },
            {
                $project: {
                    CreatedAt: 1,
                    BecomeResolvedAt: 1
                }
            }
        ]);

        for (const ticket of tickets) {
            if (ticket.CreatedAt >= weekStartUTC && ticket.CreatedAt <= weekEndUTC) {
                const createdDateGMT7 = new Date(ticket.CreatedAt.getTime() + gmtPlus7Offset);
                const createdDate = createdDateGMT7.toISOString().split("T")[0].slice(5, 10);
                const found = initChartData.find(d => d.date === createdDate);
                if (found) found.received += 1;
            }
            if (ticket.BecomeResolvedAt >= weekStartUTC && ticket.BecomeResolvedAt <= weekEndUTC) {
                const resolvedDateGMT7 = new Date(ticket.BecomeResolvedAt.getTime() + gmtPlus7Offset);
                const resolvedDate = resolvedDateGMT7.toISOString().split("T")[0].slice(5, 10);
                const found = initChartData.find(d => d.date === resolvedDate);
                if (found) found.resolved += 1;
            }
        }

        return res.status(200).json(initChartData);
    } 
    catch (error) {
        console.error("Error fetching weekly ticket chart:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
  
export const getTicketbyEmergency = async (req, res) => {
    try {
            const { date, compTypeId } = req.query;
            if (!date) {
                return res.status(400).json({ message: "Date parameter is required" });
            }
            
            // set the end date to the saturday 23:59 of that week based on the selected date
            const selectedDate = new Date(date);
            const endDate = new Date(selectedDate);
            endDate.setDate(endDate.getDate() - endDate.getDay() + 6); 
            endDate.setHours(23, 59, 59, 999); 

            const matchCondition = {
                CreatedAt: { $lte: endDate }
            };

            if (compTypeId) {
                if (!mongoose.isValidObjectId(compTypeId)) {
                    return res.status(400).json({ message: "Invalid compTypeId format" });
                }
                matchCondition.CompTypeId = new mongoose.Types.ObjectId(compTypeId);
            }
            
            // get the total ticket based on the priority type
            const result = await ticketModel.aggregate([
                { $match: matchCondition },
                {
                    $group: {
                        _id: "$PriorityType",
                        count: { $sum: 1 }
                    }
                }
            ]);
            
            // map each priority type with the total ticket
            const summary = {};
            result.forEach(item => {
                summary[item._id] = item.count;
            });
            return res.status(200).json(summary);

        } 
        catch (error) {
            console.error("Error fetching emergency ticket chart:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
};

export const getTicketbyStatus = async (req, res) => {
    try {
        const { date, compTypeId } = req.query;
        if (!date) {
            return res.status(400).json({ message: "Date parameter is required" });
        }

        // set the end date to the saturday 23:59 of that week based on the selected date
        const selectedDate = new Date(date);
        const endDate = new Date(selectedDate);
        endDate.setDate(endDate.getDate() - endDate.getDay() + 6); 
        endDate.setHours(23, 59, 59, 999); 

        const matchCondition = {
            CreatedAt: { $lte: endDate }
        };

        if (compTypeId) {
            if (!mongoose.isValidObjectId(compTypeId)) {
                return res.status(400).json({ message: "Invalid compTypeId format" });
            }
            matchCondition.CompTypeId = new mongoose.Types.ObjectId(compTypeId);
        }

        // group the total tickets based on status
        const result = await ticketModel.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: "$Status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // maps each status with the total tickets
        const summary = {};
        result.forEach(item => {
            summary[item._id] = item.count;
        });
        return res.status(200).json(summary);

    } 
    catch (error) {
        console.error("Error fetching status ticket chart:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAgentTickets = async (req, res) => {
    try {
        const { date, compTypeId } = req.query;
        if (!date) {
            return res.status(400).json({ message: "Date parameter is required" });
        }

        // set the end date to the saturday 23:59 of that week based on the selected date
        const selectedDate = new Date(date);
        const endDate = new Date(selectedDate);
        endDate.setDate(endDate.getDate() - endDate.getDay() + 6); 
        endDate.setHours(23, 59, 59, 999); 

        const matchCondition = {
            CreatedAt: { $lte: endDate }
        };

        if (compTypeId) {
            if (!mongoose.isValidObjectId(compTypeId)) {
                return res.status(400).json({ message: "Invalid compTypeId format" });
            }
            matchCondition.CompTypeId = new mongoose.Types.ObjectId(compTypeId);
        }

        // get the ticket count for each agent and sort them by total ticket descending
        const pipeline = [
            { $match: matchCondition },
            { $unwind: "$HandledBy" },
            {
              $group: {
                _id: "$HandledBy",
                ticketCount: { $sum: 1 }
              }
            },
            {
              $lookup: {
                from: "users", 
                localField: "_id",
                foreignField: "_id",
                as: "agent"
              }
            },
            {
              $unwind: "$agent"
            },
            {
              $project: {
                _id: 0,
                agentId: "$agent._id",
                agentName: "$agent.FullName", 
                ticketCount: 1
              }
            },
            { $sort: { ticketCount: -1 } } 
          ];
      
          const result = await ticketModel.aggregate(pipeline);
          return res.status(200).json(result);

    } 
    catch (error) {
        console.error("Error fetching status ticket chart:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getRatingMetrics = async (req, res) => {
    try {
        const { date, compTypeId } = req.query;
        if (!date) {
            return res.status(400).json({ message: "Date parameter is required" });
        }

        // set the end date to the saturday 23:59 of that week based on the selected date
        const selectedDate = new Date(date);
        const endDate = new Date(selectedDate);
        endDate.setDate(endDate.getDate() - endDate.getDay() + 6); 
        endDate.setHours(23, 59, 59, 999); 

        // map the the ticket model with the rating model based on the ticket id
        const pipeline = [
            { $match: {createdAt: { $lte: endDate }}},
            {
                $lookup: {
                    from: "tickets",
                    localField: "TicketId",
                    foreignField: "_id",
                    as: "ticket"
                },
            },
            {   $unwind: "$ticket" }
        ];

        // filter based on competition type Id
        if (compTypeId) {
            if (!mongoose.isValidObjectId(compTypeId)) {
                return res.status(400).json({ message: "Invalid compTypeId format" });
            }
            pipeline.push({ 
                $match: { "ticket.CompTypeId": new mongoose.Types.ObjectId(compTypeId) }
            });
        }

        // group the rating based on the ticket competition type id
        pipeline.push({
            $group: {
                _id: "$ticket.CompTypeId",
                averageRating: { $avg: "$Rating" }
            }
        });
        
        // there are 5 levels of rating, so to convert to percentage number, we multiply by 20
        const result = await ratingModel.aggregate(pipeline);
        return res.status(200).json({
            avgRating: result.length > 0 ? (result[0].averageRating)*20 : 0
        });

    } 
    catch (error) {
        console.error("Error fetching rating metrics:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};