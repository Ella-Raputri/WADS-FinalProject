import { Button } from "./ui/button";

export const UserData = ({ 
    name, mandarinName, DOB, gender, fullAddress, phoneNumber, email, institution, studentCardUrl 
}) => {
    
    const handleRedirect = () => {
        if (studentCardUrl) {
            window.open(studentCardUrl, "_blank");
        } else {
            alert("Student card not available.");
        }
    };

    return (
        <div className="grid max-w-full text-lg grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-5 mt-5 p-4 md:p-6 border rounded-lg shadow-md bg-white">
            {/* Name */}
            <p className="text-[#DD3833] font-bold font-poppins">Name:</p>
            <p className="font-poppins break-words">{name}</p>

            {/* Mandarin Name */}
            <p className="text-[#DD3833] font-bold font-poppins">Mandarin Name:</p>
            <p className="font-poppins break-words">{mandarinName}</p>

            {/* Date of Birth */}
            <p className="text-[#DD3833] font-bold font-poppins">Date of Birth:</p>
            <p className="font-poppins">{DOB}</p>

            {/* Gender */}
            <p className="text-[#DD3833] font-bold font-poppins">Gender:</p>
            <p className="font-poppins">{gender}</p>

            {/* Address */}
            <p className="text-[#DD3833] font-bold font-poppins">Full Address:</p>
            <p className="font-poppins break-words">{fullAddress}</p>

            {/* Phone Number */}
            <p className="text-[#DD3833] font-bold font-poppins">Phone Number:</p>
            <p className="font-poppins">{phoneNumber}</p>

            {/* Email */}
            <p className="text-[#DD3833] font-bold font-poppins">Email:</p>
            <p className="font-poppins break-words">{email}</p>

            {/* Institution */}
            <p className="text-[#DD3833] font-bold font-poppins">Institution:</p>
            <p className="font-poppins">{institution}</p>

            {/* Student Card Button */}
            <p className="text-[#DD3833] font-bold font-poppins">Student Card:</p>
            <Button 
                className="shadow-md rounded-md bg-red-600 hover:bg-red-700 px-4 py-2 text-white font-poppins cursor-pointer font-semibold transition-all"
                onClick={handleRedirect}
            >
                See here
            </Button>

            

        </div>
    );
};
