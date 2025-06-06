import React, { useContext, useEffect } from 'react';
import { faChevronLeft, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadImage from '@/components/UploadImage';
import { AppContent } from '@/context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const NewTicket = () => {
    const [message, setMessage] = useState("");
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState("");
    const [subj, setSubj] =useState("");
    const [priority, setPriority] =useState("Low");
    const [compType, setCompType] =useState("Junior Singing");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {backendUrl, userData, socket, initializeSocket, uploadImage} = useContext(AppContent)

    useEffect(() => {
        if (!userData || !userData.id) return; 
    
        if (!socket) {
            initializeSocket(userData.id);
        }
    }, [userData]);


    // submit handler
    const handleSubmit=async(e)=>{
        setLoading(true);
        e.preventDefault();
        axios.defaults.withCredentials =true

        try {
            // get competition id
            const response = await axios.get(backendUrl + `api/competition/getCompetitionIdByName?compName=${compType}`);
            const compData = response.data

            // create new ticket
            let newTicketData = {
                subject: subj,
                priorityType: priority,
                description:message,
                compTypeId: compData.id,
            }

            // upload image if there is image
            if(image){
                const linkResult = await uploadImage(image);
                newTicketData = {
                    ...newTicketData,
                    imageUrl: linkResult
                };
            }

            // make new ticket
            const { data } = await axios.post(backendUrl + 'api/ticket/uploadNewTicket', {newTicketDetails: newTicketData});
            if(data.success) {
              navigate('/userhelp');
              toast.success("Ticket created successfully.")
            } 
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || error.message || "Ticket creation failed");
        }
        setLoading(false);
    }


  return (
    <div className='mt-25 ml-4 mr-8 md:ml-20 ' >
        {/* headers */}
        <div className='flex'>
            <button className="bg-white text-slate-500 border shadow-md border-slate-300 w-10 h-10 flex items-center justify-center rounded-full hover:cursor-pointer hover:bg-gray-100"
            onClick={() => navigate('/userhelp')}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <h1 className='font-medium text-3xl font-kanit ml-6'>
                New Help Ticket
            </h1>
        </div>

        <form className="space-y-6 font-poppins" onSubmit={handleSubmit}>
            {/* Subject */}
            <div>
                <label className="color-text-red font-semibold block mb-2 mt-5 ml-16 text-xl">Subject</label>
                <input
                    type="text"
                    className="ml-16 w-3/5 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-5 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow p-2"
                    placeholder="Enter subject"
                    value={subj}
                    onChange={(e) => setSubj(e.target.value)}
                />
            </div>

            {/* Priority Dropdown */}
            <div>
                <label className="ml-16 text-xl mt-8  color-text-red font-semibold block mb-2">Priority</label>
                <select 
                    value={priority}
                    onChange={(e)=>setPriority(e.target.value)}
                    className="cursor-pointer ml-16 w-3/5 bg-white placeholder:text-slate-400 text-slate-700 text-md border border-slate-300 rounded-md pl-3 pr-5 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow p-2"
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                </select>
            </div>

            {/* Competition type */}
            <div>
                <label className="ml-16 text-xl mt-8  color-text-red font-semibold block mb-2">Competition Type</label>
                <select 
                value={compType}
                onChange={(e)=>setCompType(e.target.value)}
                className="cursor-pointer ml-16 w-3/5 bg-white placeholder:text-slate-400 text-slate-700 text-md border border-slate-300 rounded-md pl-3 pr-5 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow p-2">
                    <option value="Junior Singing">Junior Singing</option>
                    <option value="Senior Singing">Senior Singing</option>
                    <option value="Speech">Speech</option>
                    <option value="Storytelling">Storytelling</option>
                    <option value="Dubbing Contest">Dubbing</option>
                    <option value="Poster Design Contest">Poster Design</option>
                </select>
            </div>

            {/* Message */}
            <div>
                <label className="ml-16 text-xl mt-8 color-text-red font-semibold block mb-2">Message</label>
                <textarea
                    className="resize-none ml-16 w-3/5 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow p-2 h-32"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>

            {/* Image Upload */}
            <div className='ml-16 mt-4 z-10'>
                <UploadImage image={image} imageName={imageName} setImage={setImage} setImageName={setImageName} inputId={'new-ticket-image-upload'}/>
            </div>

            {/* Submit Button */}
            <button type='submit' className={`${loading? 'cursor-not-allowed': 'cursor-pointer'} hover:bg-red-700 mb-30 ml-16 mt-8 text-md p-5 font-semibold bg-red-600 text-white py-2 rounded-md shadow-md ease transition duration-200`}>
                {loading? 
                    <svg className="animate-spin m-auto h-6 w-6 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                :'Create Ticket'}
            </button>
        </form>
      

    </div>
  );
};

export default NewTicket;
