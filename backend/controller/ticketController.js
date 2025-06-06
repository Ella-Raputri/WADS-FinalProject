import mongoose from "mongoose";
import adminUserChatModel from "../models/adminUserChatModel.js";
import ticketModel from "../models/ticketModel.js";
import ratingModel from "../models/ratingModel.js";

export const uploadNewTicket =async(req,res)=>{
    const {userId, newTicketDetails} = req.body;
    
    if(!newTicketDetails.subject || !newTicketDetails.description){
        return res.status(400).json({success:false, message:"Please fill in the subject and description."})
    }

    try {
        // if there is image in the ticket
        let imageLink =''
        if(newTicketDetails.imageUrl) imageLink=newTicketDetails.imageUrl

        //create the new ticket 
        const newTicket = new ticketModel({
            Subject: newTicketDetails.subject,
            PriorityType: newTicketDetails.priorityType,
            Status: "Open",
            Description: newTicketDetails.description,
            Image: imageLink,
            SenderId: userId,
            CompTypeId: newTicketDetails.compTypeId
        });

        await newTicket.save();
        return res.status(200).json({ success: true, message: "Ticket created successfully" });

    } catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }
}

export const getAllTickets = async(req,res)=>{
    try {
        //get all tickets sent by that user
        const {userId} = req.body;
        const tickets = await ticketModel.find({SenderId: userId});
        return res.status(200).json({success:true, tickets})
        
    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
        
    }
}

export const getAllTicketsByCompetitionType = async(req,res)=>{
    try {
        //get all tickets that is related to that competition type
        const compId = req.query.compId;  
        const tickets = await ticketModel.find({CompTypeId: compId});
        return res.status(200).json({success:true, tickets})

    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
        
    }
}

export const updateTicketStatus = async(req,res)=>{
    const {request} =req.body;

    try {
        //find the ticket
        const ticket = await ticketModel.findById(request.ticketId);
        ticket.Status = request.status; //change the ticket status

        const now = new Date();
        
        if(request.status == "Closed"){
            if (!ticket.BecomeInProgressAt) {
                ticket.BecomeInProgressAt = now;
            }
            if (!ticket.BecomeResolvedAt) {
                ticket.BecomeResolvedAt = now;
            }
            ticket.BecomeClosedAt = now; //assign current datetime to BecomeClosedAt if the ticket is closed
        }
        else if(request.status == "Resolved"){
            if (!ticket.BecomeInProgressAt) {
                ticket.BecomeInProgressAt = now;
            }
            ticket.BecomeResolvedAt = now; //assign current datetime to BecomeResolvedAt if the ticket is resolved
        }
        else if(request.status == "In Progress"){
            ticket.BecomeInProgressAt = now; //assign current datetime to BecomeInProgressAt if the ticket is in progress
        }
        await ticket.save();

        return res.status(200).json({success:true, message:"Ticket status updated successfully"})

    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
    }
}

export const getUpdatedAtByTicketId = async (req, res) => {
    try {
        const { ticketId } = req.query;        
        if (!ticketId || !mongoose.isValidObjectId(ticketId)) {
            return res.status(400).json({ message: "Invalid or missing ticketId" });
        }
        // get the latest updatedAt of the ticket based on last chat time from user and admin
        const latestChat = await adminUserChatModel.findOne({ TicketId: ticketId })
        .sort({ updatedAt: -1 }).select("updatedAt");     
      
        if (!latestChat) {
            // if there is no chat yet, use createdAt time
            const created = await ticketModel.findById(ticketId).select("CreatedAt");
            return res.status(200).json({ latestUpdatedAt: created.CreatedAt });
        }
        return res.status(200).json({ latestUpdatedAt: latestChat.updatedAt });
        
    } 
    catch (error) {
        console.error("Error fetching updatedat:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateRateTicket = async (req, res) => {
    const {userId, ticketId, adminId, rating, comment} = req.body;
    if(!rating){
        return res.status(400).json({success:false, message:"Please give the rating."})
    }

    try {
        //create new rating for that ticket
        const newRating = new ratingModel({
            TicketId: ticketId,
            AdminId: adminId,
            UserId: userId,
            Rating: rating,
            Comment: comment
        })
        await newRating.save();
        return res.status(200).json({ success: true, message: "Thank you for your rating!" });

    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
    }
}

export const fetchTicketRating = async(req,res) =>{
    const ticketId = req.query.ticketId;
    try {
        //get the rating of that ticket
        const rating = await ratingModel.findOne({TicketId: ticketId});
        return res.status(200).json({success:true, rating});

    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
    }
}

export const updateHandledBy = async (req, res) => {
  const { request } = req.body;

  try {
    const ticket = await ticketModel.findById(request.ticketId);
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });

    if (Array.isArray(request.handledBy)) {
      ticket.HandledBy = request.handledBy; 
    }

    await ticket.save();

    return res.status(200).json({ success: true, message: "Ticket handlers updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
