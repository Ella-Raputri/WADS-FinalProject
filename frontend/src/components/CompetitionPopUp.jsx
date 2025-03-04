import Modal from "react-modal";

export const CompetitionPopUp = ({competition, isOpen, onClose}) => {
    let requirement_arr = competition.rules.split("\n");
    return (
        <Modal competition={competition} isOpen={isOpen} onRequestClose={onClose} className="w-[80%] h-[80vh] bg-white mx-auto shadow-xl relative overflow-y-auto scrollbar-thin rounded-[10px]" overlayClassName="flex justify-center items-center inset-0 fixed z-1000 bg-[rgba(0,0,0,0.5)]">
            <div className="top-0 sticky pt-1 bg-white">
                <p className="font-kanit text-[1.5rem] mt-[1.5em] ml-[2em]">{competition.title}</p>
                <p className="font-poppins ml-[4em] text-[0.8rem]">Price: {competition.price} / Person</p>
                <i className="text-[2.3rem] absolute top-0 right-0 mr-[1.5em] mt-[0.4em] cursor-pointer" onClick={onClose}>&times;</i>
                <div className="w-[80%] h-[0.05em] bg-gray-400 ml-[3.1em] mt-[0.5em]"></div>
            </div>
            <p className="font-poppins ml-[4em] text-[0.8rem] mt-[1em]">Venue: {competition.venue}</p>
            <p className="font-poppins ml-[4em] text-[0.8rem] mt-[0.6em]">Date: {competition.date}</p>
            <p className="font-poppins ml-[4em] text-[0.8rem] mt-[0.6em]">Time: {competition.time}</p>
            <p className="font-poppins ml-[4em] text-[0.8rem] mt-[0.6em]">Prizepool: {competition.prizepool}</p>
            <p className="font-poppins ml-[3.5em] text-[0.9rem] font-semibold mt-[1em]">Rules / Requirements</p>
            <ul className="list-disc ml-[4em]">
                {requirement_arr.map((line) => (
                    <li className={`w-[80%] font-poppins text-[0.8rem] mt-[0.6em]`}>{line}</li>
                ))}
            </ul>
            <button className="w-25 h-9 mt-5 color-component-red rounded-md hover:!bg-red-700 text-white text-center block mx-auto mb-[3em]">Register</button>
        </Modal>
    );
}