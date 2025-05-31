import React from "react";
import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function FAQItem({ id, open, handleOpen, question, answer }) {
  return (
    <Accordion open={open === id} icon={<Icon id={id} open={open} />} className="mb-2">
      <AccordionHeader 
        onClick={() => handleOpen(id)} 
        className="font-medium text-lg text-white bg-red-600 hover:bg-red-700 shadow-md font-poppins transition duration-300 ease rounded-xl p-3 hover:cursor-pointer"
      >
        {question}
      </AccordionHeader>
      <AccordionBody className="p-3 font-poppins font-normal break-words text-md color-text-brown bg-red-200 rounded-xl">
        {answer}
      </AccordionBody>
    </Accordion>
  );
}

function AccordionFAQ() {
  const [open, setOpen] = React.useState(0);
  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const faqData = [
    { id: 1, question: "What is National Mandarin Competition?", answer: "NMC (National Mandarin Competition) is an event organized by BNMC (BINUS Mandarin Club) with the aim of improving Mandarin language skills and preserving Chinese culture." },
    { id: 2, question: "How many competitions are there in NMC?", answer: "There are 3 categories of competitions in NMC: Main Competition (Junior Singing, Senior Singing, Storytelling, Speech), Special Contest (Dubbing), and Mini Contest (Poster Design)." },
    { id: 3, question: "How much is the registration fee?", answer: "The registration fees for each competition are as follows: Rp200.000 for Singing Senior, Storytelling, and Speech, Rp180.000 for Singing Junior, Rp120.000 for Dubbing, and Rp75.000 for Poster Design." },
    { id: 4, question: "What is the age restriction for each competition?", answer:"The age restrictions for each competition: Singing (Junior): 8 – 15 years, Singing (Senior): 16 – 24 years, Storytelling: 13 – 21 years, Speech: 13 – 21 years, Dubbing: 16 – 24 years, Poster Design: 16 – 24 years." },
    { id: 5, question: "Where can I get more information about NMC?", answer: "You can get more information about NMC through the official Instagram NMC: @nmcbnmc" }
  ];

  return (
    <>
      {faqData.map((item) => (
        <FAQItem 
          key={item.id} 
          id={item.id} 
          open={open} 
          handleOpen={handleOpen} 
          question={item.question} 
          answer={item.answer} 
        />
      ))}
    </>
  );
}

export default AccordionFAQ;