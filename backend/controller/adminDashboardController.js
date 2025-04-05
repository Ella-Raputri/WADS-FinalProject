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

        const matchCondition = { CreatedAt: { $lte: endDate } };
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

        const matchCondition = { CreatedAt: { $lte: endDate } };
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
            CreatedAt: { $lte: endDate },
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

    const selectedDate = new Date(date);
    const weekStart = new Date(selectedDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Sunday (0)
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6); // Saturday
    weekEnd.setHours(23, 59, 59, 999);

    const match = {
      $and: [
        {
          $or: [
            { CreatedAt: { $gte: weekStart, $lte: weekEnd } },
            { BecomeResolvedAt: { $gte: weekStart, $lte: weekEnd } }
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

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const initChartData = dayNames.map(day => ({ dayName: day, received: 0, resolved: 0 }));

    const tickets = await ticketModel.aggregate([
      { $match: match },
      {
        $project: {
          createdDay: {
            $cond: [
              { $and: [{ $gte: ["$CreatedAt", weekStart] }, { $lte: ["$CreatedAt", weekEnd] }] },
              { $dayOfWeek: "$CreatedAt" },
              null
            ]
          },
          resolvedDay: {
            $cond: [
              { $and: [{ $gte: ["$BecomeResolvedAt", weekStart] }, { $lte: ["$BecomeResolvedAt", weekEnd] }] },
              { $dayOfWeek: "$BecomeResolvedAt" },
              null
            ]
          }
        }
      }
    ]);

    for (const ticket of tickets) {
      if (ticket.createdDay) {
        const index = (ticket.createdDay + 5) % 7; 
        initChartData[index].received += 1;
      }
      if (ticket.resolvedDay) {
        const index = (ticket.resolvedDay + 5) % 7; 
        initChartData[index].resolved += 1;
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
    
            const result = await ticketModel.aggregate([
                { $match: matchCondition },
                {
                    $group: {
                        _id: "$PriorityType",
                        count: { $sum: 1 }
                    }
                }
            ]);

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

        const result = await ticketModel.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: "$Status",
                    count: { $sum: 1 }
                }
            }
        ]);

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