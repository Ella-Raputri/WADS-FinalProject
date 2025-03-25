import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { Button } from './ui/button';

function UploadImage({image, setImage, imageName, setImageName, isImageSmall}) {

    const handleImageUpload = (event) => {
        const file = event.target.files[0]; // Get the selected file
    
        if (!file) {
            console.error("No file selected.");
            return;
        }
    
        const img = new Image();
        const objectURL = URL.createObjectURL(file); // Ensure valid file before calling this
        img.src = objectURL;
    
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
    
            // Set max width & height
            const maxWidth = 400;
            const maxHeight = 350;
    
            let width = img.width;
            let height = img.height;
    
            if (width > maxWidth || height > maxHeight) {
                if (width / height > maxWidth / maxHeight) {
                    height = (maxWidth / width) * height;
                    width = maxWidth;
                } else {
                    width = (maxHeight / height) * width;
                    height = maxHeight;
                }
            }
    
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
    
            // Convert to base64 and update state
            setImage(canvas.toDataURL("image/png"));
    
            // Release the object URL to free memory
            URL.revokeObjectURL(objectURL);
        };
    
        img.onerror = () => {
            console.error("Failed to load image.");
        };
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

  return (
    <div>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="file-upload" />
            <Button type='button' className={`pl-3 pr-2 py-5 mb-2 text-sm bg-white border shadow-md border-slate-300 hover:bg-gray-100 cursor-pointer text-gray-700 ${image ? "text-green-500" : "text-slate-500"}`}>
                <label htmlFor="file-upload" className="cursor-pointer flex items-center">
                    Upload Image &nbsp; <FontAwesomeIcon icon={faImage} />
                </label>
            </Button>
            {imageName && (
                    <span className="text-gray-700 ml-1 md:ml-2 text-sm">{imageName}</span>
                )}
            {image && (
                <div className='mt-4'>
                <img src={image} alt="Uploaded preview" className={`mt-5 max-w-full max-h-72 rounded-lg border-2 border-dashed border-gray-500` }/>
                <Button type='button' className="mt-4 hover:bg-red-50 cursor-pointer text-red-500 border border-red-300 bg-white" onClick={() => {setImage(null); setImageName("")}}>
                    Remove
                </Button>
                </div>)}
    </div>
  )
}

export default UploadImage