import React, { useState, useEffect } from 'react';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useNavigate } from 'react-router-dom';

const ParticipantDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState(null);
    const [updatedStatus, setUpdatedStatus] = useState("");

    useEffect(() => {
        if (location.state?.data) {
            setData(location.state.data);
            setUpdatedStatus(location.state.data.status);
        }
    }, [location.state?.data]);

    const excludedKeys = ["id", "student_card_photo", "payment_proof", "upload_twibbon_proof", "status"];

    const handleButtons = (val) => {
        const up = val === 'accept' ? 'Accepted' : 'Rejected';
        setUpdatedStatus(up);
        setData(prevData => ({
            ...prevData,
            status: updatedStatus
        }));
    };

    if (!data) {
        return <p className="text-center text-lg text-gray-600">Loading...</p>;
    }

    return (
        <div className='mt-25 ml-4 mr-8 md:ml-20'>
            <div className='flex'>
                <button className="bg-white text-slate-500 border shadow-md border-slate-300 w-10 h-10 flex items-center justify-center rounded-full hover:cursor-pointer hover:bg-gray-100"
                        onClick={() => navigate('/admincomp', { state: { updatedData: { ...data, status: updatedStatus } } })}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <h1 className='font-medium text-3xl font-kanit ml-6'>
                    Participant Details
                </h1>
            </div>

            <div className='p-8 text-lg mt-5 ml-15 font-poppins w-60% bg-white rounded-2xl shadow-md border-l border-b border-l-neutral-300 border-b-neutral-300'>
                {Object.entries(data)
                    .filter(([key]) => !excludedKeys.includes(key))
                    .map(([key, value]) => (
                        <p key={key} className="mb-3">
                            <b className="text-red-700">
                                {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}:
                            </b>{" "}
                            &nbsp;{value}
                        </p>
                    ))}

                <p className='mb-2 text-red-700'><b>Student Card Photo:</b></p>
                <img src={data.student_card_photo} alt="Student Card" className='mb-5 w-80 rounded-lg' />

                <p className='mb-2 text-red-700'><b>Payment Proof:</b></p>
                <img src={data.payment_proof} alt="Payment Proof" className='mb-5 w-80 rounded-lg' />

                <p className='mb-2 text-red-700'><b>Uploaded Twibbon Proof:</b></p>
                <img src={data.upload_twibbon_proof} alt="Twibbon Proof" className='mb-5 w-80 rounded-lg' />
            </div>

            <div className='flex flex-col text-lg justify-center ml-15 mt-5 mb-15 text-center text-white font-poppins font-semibold'>
                {data.status === 'Accepted' && (
                    <span className="px-2 py-1 text-white bg-lime-500 rounded-full">Accepted</span>
                )}
                {data.status === 'Rejected' && (
                    <span className="px-2 py-1 text-white bg-red-400 rounded-full">Rejected</span>
                )}
                {data.status === 'Pending' && (
                    <div className='flex justify-center gap-15'>
                        <button onClick={() => handleButtons('accept')} className="p-3 shadow-md text-white bg-lime-500 hover:bg-lime-600 rounded-2xl cursor-pointer">
                            Accept
                        </button>
                        <button onClick={() => handleButtons('reject')} className="p-3 shadow-md text-white bg-red-400 hover:bg-red-500 rounded-2xl cursor-pointer">
                            Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParticipantDetails;
