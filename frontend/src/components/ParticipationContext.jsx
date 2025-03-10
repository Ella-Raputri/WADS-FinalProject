import { createContext, useState } from 'react';

// Create Context
export const ParticipantContext = createContext();

export const ParticipantProvider = ({ children }) => {
    const [participants, setParticipants] = useState([]); // Store participants list

    return (
        <ParticipantContext.Provider value={{ participants, setParticipants }}>
            {children}
        </ParticipantContext.Provider>
    );
};
