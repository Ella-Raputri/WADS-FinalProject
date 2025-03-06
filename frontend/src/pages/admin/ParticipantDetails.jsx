import React from 'react';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ParticipantDetails = ({name, email, phonenumber}) => {
    const [message, setMessage] = useState("");
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState("");

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file)); // Preview image
            setImageName(shortenFileName(file.name)); // Shorten filename
        }
    };

    const shortenFileName = (name) => {
        const maxLength = 50; // Adjust the length as needed
        const ext = name.split(".").pop(); // Get file extension
        const baseName = name.substring(0, name.lastIndexOf(".")); // Remove extension

        if (baseName.length > maxLength) {
            return `${baseName.substring(0, 20)}...${baseName.slice(-4)}.${ext}`;
        }
        return name;
    };

    const navigate = useNavigate();

  return (
    <div className='mt-25 ml-4 mr-8 md:ml-20 ' >
        
        <div className='flex'>
            <button className="border border-gray-600 w-10 h-10 flex items-center justify-center rounded-full hover:cursor-pointer hover:bg-gray-100"
            onClick={() => navigate('/admincomp')}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <h1 className='font-medium text-3xl font-kanit ml-6'>
                Participant Details
            </h1>
        </div>

        <form className="space-y-4 font-poppins">
            {/* Subject */}
            <div>
                <label className="color-text-red font-semibold block mb-2 mt-5 ml-16 text-xl">Subject</label>
                <input
                    type="text"
                    className="ml-16 w-3/5 border rounded-lg p-2"
                    placeholder="Enter subject"
                />
            </div>

            {/* Priority Dropdown */}
            <div>
                <label className="ml-16 text-xl mt-8  color-text-red font-semibold block mb-2">Priority</label>
                <select className="cursor-pointer ml-16 w-3/5 border rounded-lg p-2">
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
                    className="resize-none ml-16 w-3/5 border rounded-lg p-2 h-32"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>

            {/* Image Upload */}
            <div className='ml-16 mt-10'>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer hover:bg-gray-300 bg-gray-200 px-4 py-2 rounded-lg inline-block text-gray-700">
                    Upload Image
                </label>
                {imageName && (
                        <span className="text-gray-700 ml-1 md:ml-2 text-sm">{imageName}</span>
                    )}
                {image && <img src={image} alt="Uploaded preview" className="mt-5 w-80 rounded-lg border-2 border-dashed border-gray-500" />}
            </div>

            {/* Submit Button */}
            <button className="cursor-pointer hover:bg-red-800 mb-30 ml-16 mt-8 text-lg p-5 font-semibold bg-red-700 text-white py-2 rounded-full">CREATE TICKET</button>
        </form>
      

    </div>
  );
};

export default ParticipantDetails;
