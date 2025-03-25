import React from 'react';
import { faChevronLeft, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadImage from '@/components/UploadImage';

const NewTicket = () => {
    const [message, setMessage] = useState("");
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState("");

    

    const navigate = useNavigate();

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

        <form className="space-y-4 font-poppins">
            {/* Subject */}
            <div>
                <label className="color-text-red font-semibold block mb-2 mt-5 ml-16 text-xl">Subject</label>
                <input
                    type="text"
                    className="ml-16 w-3/5 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-5 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow p-2"
                    placeholder="Enter subject"
                />
            </div>

            {/* Priority Dropdown */}
            <div>
                <label className="ml-16 text-xl mt-8  color-text-red font-semibold block mb-2">Priority</label>
                <select className="cursor-pointer ml-16 w-3/5 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-5 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow p-2">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
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
            <div className='ml-16 mt-10'>
                <UploadImage image={image} imageName={imageName} setImage={setImage} setImageName={setImageName} />
            </div>

            {/* Submit Button */}
            <button className="cursor-pointer hover:bg-red-700 mb-30 ml-16 mt-8 text-md p-5 font-semibold bg-red-600 text-white py-2 rounded-md shadow-md ease transition duration-200">
                Create Ticket</button>
        </form>
      

    </div>
  );
};

export default NewTicket;
