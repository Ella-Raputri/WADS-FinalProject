import ticketModel from "../models/ticketModel.js";

export const uploadNewTicket =async(req,res)=>{
    const {userId, newTicketDetails} = req.body;
    
    if(!newTicketDetails.subject || !newTicketDetails.description){
        return res.json({success:false, message:"Please fill in the subject and description."})
    }

    try {
        let imageLink =''
        if(newTicketDetails.imageUrl) imageLink=newTicketDetails.imageUrl

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
        return res.json({ success: true, message: "Ticket created successfully" });

    } catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }
}


export const getAllTickets = async(req,res)=>{
    try {
        const {userId} = req.body;
        const tickets = await ticketModel.find({SenderId: userId});

        return res.json({success:true, tickets})
        

    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
        
    }
}

export const getAllTicketsByCompetitionType = async(req,res)=>{
    try {
        const compId = req.query.compId;  
        const tickets = await ticketModel.find({CompTypeId: compId});

        return res.json({success:true, tickets})
        

    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
        
    }
}


export const updateTicketStatus = async(req,res)=>{
    const {request} =req.body;

    try {
        const ticket = await ticketModel.findById(request.ticketId);
        ticket.Status = request.status;
        
        if(request.status == "Closed"){
            ticket.BecomeClosedAt = new Date();
        }
        else if(request.status == "Resolved"){
            ticket.BecomeResolvedAt = new Date();
        }
        await ticket.save();

        return res.json({success:true, message:"Ticket status updated successfully"})

    } catch (error) {
        return res.status(500).json({success:false, message:error.message}) 
    }
}