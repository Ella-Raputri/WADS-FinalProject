import React, { useState, useEffect } from 'react';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

const ParticipantDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState(null);
    const [updatedStatus, setUpdatedStatus] = useState("");
    const [message, setMessage] =useState('');

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
            status: up
        }));
    };

    if (!data) {
        return <Loading/>;
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
                            <b className="text-[#DD3833]">
                                {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}:
                            </b>{" "}
                            &nbsp;{value}
                        </p>
                    ))}

                <p className='mb-2 text-[#DD3833]'><b>Student Card Photo:</b></p>
                <img src={data.student_card_photo} alt="Student Card" className='mb-5 w-80 rounded-lg' />

                <p className='mb-2 text-[#DD3833]'><b>Payment Proof:</b></p>
                <img src={data.payment_proof} alt="Payment Proof" className='mb-5 w-80 rounded-lg' />

                <p className='mb-2 text-[#DD3833]'><b>Uploaded Twibbon Proof:</b></p>
                <img src={data.upload_twibbon_proof} alt="Twibbon Proof" className='mb-5 w-80 rounded-lg' />
            </div>
            
            <div className='flex flex-col text-lg justify-center ml-15 mt-5 mb-15 '>
                {data.status === 'Accepted' && (
                    <span className="px-2 py-1 text-white bg-lime-500 rounded-full text-center font-poppins font-semibold">Accepted</span>
                )}
                {data.status === 'Rejected' && (
                    <span className="px-2 py-1 text-white bg-red-400 rounded-full text-center font-poppins font-semibold">Rejected</span>
                )}
                {data.status === 'Pending' && (
                    <Card className=''>
                    <CardContent>
                        <p className='font-kanit font-medium text-2xl mb-4'>Admin Comments</p>
                        <textarea
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full mb-5 min-h-56 max-h-56 text-md bg-white placeholder:text-slate-400 text-slate-700 border border-slate-300 rounded-md pl-3 pr-2 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
                            ></textarea>
                            
                        <div className='flex justify-center gap-15'>
                            <button onClick={() => handleButtons('accept')} className="text-center px-3 py-2 shadow-md text-white font-poppins bg-lime-500 hover:bg-lime-600 rounded-md font-semibold cursor-pointer">
                                Accept
                            </button>
                            <button onClick={() => handleButtons('reject')} className="text-center px-3 py-2 shadow-md text-white font-poppins bg-red-400 hover:bg-red-500 rounded-md font-semibold  cursor-pointer">
                                Reject
                            </button>
                        </div>
                    </CardContent>
                    </Card>
                )}
            </div>
                
            
        </div>
    );
};

export default ParticipantDetails;
