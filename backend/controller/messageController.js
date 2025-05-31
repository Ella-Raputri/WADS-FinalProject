import { getReceiverSocketId } from "../config/socket.js";
import adminCollabChatModel from "../models/adminCollabChatModel.js";
import adminUserChatModel from "../models/adminUserChatModel.js";
import mongoose from "mongoose";
import chatbotModel from "../models/chatbotModel.js";
import axios from "axios";
import { queryRAG } from "../config/rag.js";

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

        return res.status(200).json({ success: true, adminUserChat: formattedMessages });

    } catch (error) {
        console.error("Error fetching admin participant message:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const sendParticipantAdminMessage =async(req,res)=>{
    const {userId, request} = req.body;
    if(!request.subject || !request.message){
        return res.status(400).json({ success: false, message: "Please fill the subject and message field" });
    }

    try {
        // if an image is also sent in the message
        let imageLink =''
        if(request.imageUrl) imageLink=request.imageUrl

        // create a new message 
        const newMessage = new adminUserChatModel({
            TicketId: request.ticketId,
            SenderId: userId,
            CompTypeId: request.compTypeId,
            Subject: request.subject,
            Message: request.message,
            Image: imageLink
        });
        await newMessage.save();

        return res.status(200).json({ success: true, message: "Message created successfully" });

    } catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }
}

export const sendParticipantSystemMessage =async(req,res)=>{
    const {request} = req.body;
    try {
        //create a new message from the system
        const newMessage = new adminUserChatModel({
            TicketId: request.ticketId,
            SenderId: "system",
            CompTypeId: request.compTypeId,
            Subject: request.subject,
            Message: request.message,
        });

        await newMessage.save();
        return res.status(200).json({ success: true, message: "Message created successfully" });

    } catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }
}


export const getAllCollabAdminMessage = async(req,res)=>{
    try {
        //get the admin collab messages on a ticket
        const ticketId = req.query.ticketId;
        const adminCollabChat = await adminCollabChatModel.find({TicketId: ticketId});

        return res.status(200).json({success:true, adminCollabChat})
        
    } catch (error) {
        console.error("Error fetching admin collab message:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const sendCollabAdminMessage =async(req,res)=>{
    const {userId, request} = req.body;
    if(!request.message){
        return res.status(400).json({ success: false, message: "Please fill the message field" });
    }

    try {
        //if image is sent on the message
        let imageLink =''
        if(request.imageUrl) imageLink=request.imageUrl

        //create the new message
        const newMessage = new adminCollabChatModel({
            TicketId: request.ticketId,
            AdminId: userId,
            Message: request.message,
            Image: imageLink
        });

        await newMessage.save();
        return res.status(200).json({ success: true, message: "Message created successfully" });

    } catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }
}


export const getAllChatbotMessage = async(req,res)=>{
    try {
        //get all chatbot messages based on the user id
        const userId =req.query.userId;
        const chat = await chatbotModel.find({SenderId: userId});

        return res.status(200).json({success:true, chat})
        
    } catch (error) {
        console.error("Error fetching chatbot message:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}


export const sendChatbotMessage = async (req, res) => {
    const { userId, message, role } = req.body;

    if (!message) {
        return res.status(400).json({ success: false, message: "Please fill the message field" });
    }

    if (!userId) {
        return res.status(201).json({ success: true, message: "User ID not provided, message not saved." });
    }

    try {
        //create the new message
        const newMessage = new chatbotModel({
            SenderId: userId,
            Message: message,
            Role: role
        });

        await newMessage.save();

        return res.status(200).json({ success: true, message: "Message created successfully" });

    } catch (error) {
        console.error("Error saving message:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const generateBotRes = async(req,res) =>{
    const {lastMsg} = req.body;

    try {
        //get the response based on RAG from the LLM
        const ragResponse = await queryRAG(lastMsg);
        res.status(200).json({
            message: ragResponse.result,
            sources: ragResponse.sources,
        });
      } 
      catch (err) {
        console.error('Gemini API Error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to generate content' });
      }
}