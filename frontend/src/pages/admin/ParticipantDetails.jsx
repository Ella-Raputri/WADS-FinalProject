import React, { useState, useEffect, useContext } from 'react';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { AppContent } from '@/context/AppContext';
import { convertToTimeZone } from '@/lib/utils';
import axios from 'axios';
import { toast } from 'react-toastify';

const ParticipantDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState(null);
    const [updatedStatus, setUpdatedStatus] = useState("");
    const [message, setMessage] =useState('');
    const {userData, socket, initializeSocket, backendUrl} =useContext(AppContent);

    useEffect(() => {
        if (location.state?.data) {
            setData(location.state.data);
            setUpdatedStatus(location.state.data.status);
            console.log(location.state.data)
        }
    }, [location.state?.data]);

    useEffect(() => {
          if (!userData || !userData.id) return; 
    
          if (!socket) {
              console.log("🔄 Initializing socket...");
              initializeSocket(userData.id);
          }
      }, [userData]);


    const handleButtons = async(val) => {
        axios.defaults.withCredentials = true
        const up = val === 'accept' ? 'Accepted' : 'Rejected';

        try {
            const response = await axios.put(backendUrl+'api/competitionRegistration/'+data._id, {status:up, adminComment:message});
            if(response.data.success){
                setUpdatedStatus(up);
                setData(prevData => ({
                    ...prevData,
                    Status: up
                }));
                toast.success(response.data.message)
            }
        } catch (error) {
            console.error(error)
        }       
        
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
                <p className="mb-3"> <b className="text-[#DD3833]">Full Name: </b>
                    &nbsp;{data.userDetails.FullName}
                </p>
                <p className="mb-3"> <b className="text-[#DD3833]">Mandarin Name: </b>
                    &nbsp;{data.userDetails.Participant.MandarinName}
                </p>
                <p className="mb-3"> <b className="text-[#DD3833]">Date of Birth: </b>
                    &nbsp;{convertToTimeZone(data.userDetails.Participant.DOB).substring(0, 10)}
                </p>
                <p className="mb-3"> <b className="text-[#DD3833]">Gender: </b>
                    &nbsp;{data.userDetails.Participant.Gender}
                </p>
                <p className="mb-3"> <b className="text-[#DD3833]">Address: </b>
                    &nbsp;{data.userDetails.Participant.Address}
                </p>
                <p className="mb-3"> <b className="text-[#DD3833]">Institution: </b>
                    &nbsp;{data.userDetails.Participant.Institution}
                </p>
                <p className="mb-3"> <b className="text-[#DD3833]">Email: </b>
                    &nbsp;{data.userDetails.Email}
                </p>
                <p className="mb-3"> <b className="text-[#DD3833]">Phone Number: </b>
                    &nbsp;{data.userDetails.PhoneNumber}
                </p>

                <p className='mb-2 text-[#DD3833]'><b>Student Card Photo:</b></p>
                <img src={data.userDetails.Participant.StudentCardPhoto} alt="Student Card" className='mb-5 w-80 rounded-lg' />

                <p className='mb-2 text-[#DD3833]'><b>Payment Proof:</b></p>
                <img src={data.PaymentProof} alt="Payment Proof" className='mb-5 w-80 rounded-lg' />

                <p className='mb-2 text-[#DD3833]'><b>Uploaded Twibbon Proof:</b></p>
                <img src={data.TwibbonProof} alt="Twibbon Proof" className='mb-5 w-80 rounded-lg' />
            </div>
            
            <div className='flex flex-col text-lg justify-center ml-15 mt-5 mb-15 '>
                {data.Status === 'Accepted' && (
                    <span className="px-2 py-1 text-white bg-lime-500 rounded-full text-center font-poppins font-semibold">Accepted</span>
                )}
                {data.Status === 'Rejected' && (
                    <span className="px-2 py-1 text-white bg-red-400 rounded-full text-center font-poppins font-semibold">Rejected</span>
                )}
                {data.Status === 'Pending' && (
                    <Card className=''>
                    <CardContent>
                        <p className='font-kanit font-medium text-2xl mb-4'>Admin Comments</p>
                        <textarea
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full mb-5 min-h-56 max-h-56 text-md font-poppins bg-white placeholder:text-slate-400 text-slate-700 border border-slate-300 rounded-md pl-3 pr-2 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
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