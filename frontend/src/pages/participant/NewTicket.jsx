import React, { useContext } from 'react';
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
    const navigate = useNavigate();
    const {backendUrl} = useContext(AppContent)


    const handleSubmit=async(e)=>{
        e.preventDefault();
        axios.defaults.withCredentials =true

        try {
            const response = await axios.get(backendUrl + `api/competition/getCompetitionIdByName?compName=${compType}`);
            const compData = response.data

            let newTicketData = {
                subject: subj,
                priorityType: priority,
                description:message,
                compTypeId: compData.id,
            }

            if(image){
                const imageFormData = new FormData();
                imageFormData.append('file', image); 

                // 2. Upload image first
                const { data: uploadData } = await axios.post(
                    backendUrl + 'api/image/upload', 
                    imageFormData, 
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                        withCredentials: true,
                    }
                ).catch(error => {
                    // Handle image upload failure
                    console.error("Image upload error:", error);
                    toast.error("Image upload failed. Please try again.");
                    throw error; // Stop execution if image upload fails
                });

                newTicketData = {
                    ...newTicketData,
                    imageUrl: uploadData.imageUrl
                };
            }

            const { data } = await axios.post(backendUrl + 'api/ticket/uploadNewTicket', {newTicketDetails: newTicketData});
            
            if(data.success) {
              navigate('/userhelp');
              toast.success("Ticket created successfully.")
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error(error)
        }
    }


  return (
    <div className='mt-25 ml-4 mr-8 md:ml-20 ' >
        
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
            <button type='submit' className="cursor-pointer hover:bg-red-700 mb-30 ml-16 mt-8 text-md p-5 font-semibold bg-red-600 text-white py-2 rounded-md shadow-md ease transition duration-200">
                Create Ticket</button>
        </form>
      

    </div>
  );
};

export default NewTicket;
