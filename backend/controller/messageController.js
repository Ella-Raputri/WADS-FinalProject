import adminCollabChatModel from "../models/adminCollabChatModel.js";
import adminUserChatModel from "../models/adminUserChatModel.js";

export const getAllParticipantAdminMessage = async(req,res)=>{
    try {
        const ticketId = req.query.ticketId;
        const adminUserChat = await adminUserChatModel.find({TicketId: ticketId});

        return res.json({success:true, adminUserChat})
        
    } catch (error) {
        console.error("Error fetching admin participant message:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

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
        console.error("Error fetching admin participant message:", error);
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