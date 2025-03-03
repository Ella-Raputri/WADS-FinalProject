import Modal from "react-modal";

export const CompetitionPopUp = ({competition, isOpen, onClose}) => {

    return (
        <Modal competition={competition} isOpen={isOpen} onRequestClose={onClose} className="w-[80%] h-[80vh] bg-white mx-auto shadow-xl relative" overlayClassName="flex justify-center items-center inset-0 fixed z-1000 bg-[rgba(0,0,0,0.5)]">
            <h1>Hello</h1>
        </Modal>
    );
}