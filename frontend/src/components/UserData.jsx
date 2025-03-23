export const UserData = ({name, mandarinName, DOB, gender, fullAddress, phoneNumber, email, institution}) => {
    return(
        <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto_1fr] gap-y-[1em] gap-x-[1.5em] mt-[2em]">
                <p className="text-[#DD3833] font-medium font-kanit">Name:</p>
                <p className="font-poppins">{name}</p>
                <p className="text-[#DD3833] font-medium font-kanit">Mandarin Name:</p>
                <p className="font-poppins">{mandarinName}</p>

                <p className="text-[#DD3833] font-medium font-kanit">Date of Birth:</p>
                <p className="font-poppins">{DOB}</p>
                <p className="text-[#DD3833] font-medium font-kanit">Gender:</p>
                <p className="font-poppins">{gender}</p>

                <p className="text-[#DD3833] font-medium font-kanit">Full Address:</p>
                <p className="font-poppins">{fullAddress}</p>
                <p className="text-[#DD3833] font-medium font-kanit">Phone Number:</p>
                <p className="font-poppins">{phoneNumber}</p>

                <p className="text-[#DD3833] font-medium font-kanit">Email:</p>
                <p className="font-poppins">{email}</p>
                <p className="text-[#DD3833] font-medium font-kanit">Institution:</p>
                <p className="font-poppins">{institution}</p>
        </div>
    )
}