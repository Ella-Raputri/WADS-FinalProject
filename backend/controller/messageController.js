import { getReceiverSocketId } from "../config/socket.js";
import adminCollabChatModel from "../models/adminCollabChatModel.js";
import adminUserChatModel from "../models/adminUserChatModel.js";
import mongoose from "mongoose";

export const getAllParticipantAdminMessage = async (req, res) => {
    try {
        const ticketId = req.query.ticketId;

        // Validate TicketId
        if (!mongoose.Types.ObjectId.isValid(ticketId)) {
            return res.status(400).json({ success: false, message: "Invalid Ticket ID" });
        }

        const adminUserChat = await adminUserChatModel.find({ TicketId: ticketId }).exec();

        // Manually populate valid ObjectId references and handle "system" strings
        const formattedMessages = await Promise.all(
            adminUserChat.map(async (msg) => {
                if (mongoose.Types.ObjectId.isValid(msg.SenderId)) {
                    // Populate only if SenderId is a valid ObjectId
                    const sender = await mongoose.model("user").findById(msg.SenderId).select("FullName Email Role");
                    return { ...msg.toObject(), SenderId: sender || null };
                } else if (msg.SenderId === "system") {
                    // Handle system messages
                    return {
                        ...msg.toObject(),
                        SenderId: { FullName: "System", Email: "system@example.com", Role: "System" },
                    };
                }
                return msg.toObject(); // Return as-is if SenderId is neither ObjectId nor "system"
            })
        );

        return res.json({ success: true, adminUserChat: formattedMessages });

    } catch (error) {
        console.error("Error fetching admin participant message:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const sendParticipantAdminMessage =async(req,res)=>{
    const {userId, request} = req.body;
    if(!request.subject || !request.message){
        return res.json({ success: false, message: "Please fill the subject and message field" });
    }

    try {
        let imageLink =''
        if(request.imageUrl) imageLink=request.imageUrl

        const newMessage = new adminUserChatModel({
            TicketId: request.ticketId,
            SenderId: userId,
            CompTypeId: request.compTypeId,
            Subject: request.subject,
            Message: request.message,
            Image: imageLink
        });
        await newMessage.save();

        return res.json({ success: true, message: "Message created successfully" });

    } catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }
}

export const sendParticipantSystemMessage =async(req,res)=>{
    const {request} = req.body;
    try {
        const newMessage = new adminUserChatModel({
            TicketId: request.ticketId,
            SenderId: "system",
            CompTypeId: request.compTypeId,
            Subject: request.subject,
            Message: request.message,
        });

        await newMessage.save();
        return res.json({ success: true, message: "Message created successfully" });

    } catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }
}

// TicketId: { type: mongoose.Schema.Types.ObjectId, ref: "ticket", required: true},
//     AdminId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
//     Message: { type: String, required: true },
//     Image: { type: String, default: null }
export const getAllCollabAdminMessage = async(req,res)=>{
    try {
        const ticketId = req.query.ticketId;
        const adminCollabChat = await adminCollabChatModel.find({TicketId: ticketId});

        return res.json({success:true, adminCollabChat})
        
    } catch (error) {
        console.error("Error fetching admin collab message:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const sendCollabAdminMessage =async(req,res)=>{
    const {userId, request} = req.body;
    if(!request.message){
        return res.json({ success: false, message: "Please fill the message field" });
    }

    try {
        let imageLink =''
        if(request.imageUrl) imageLink=request.imageUrl

        const newMessage = new adminCollabChatModel({
            TicketId: request.ticketId,
            AdminId: userId,
            Message: request.message,
            Image: imageLink
        });

        await newMessage.save();
        return res.json({ success: true, message: "Message created successfully" });

    } catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }
}