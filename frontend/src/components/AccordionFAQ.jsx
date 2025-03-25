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
      <AccordionBody className="p-3 font-normal break-words text-md color-text-brown bg-red-200 rounded-xl">
        {answer}
      </AccordionBody>
    </Accordion>
  );
}

function AccordionFAQ() {
  const [open, setOpen] = React.useState(0);
  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const faqData = [
    { id: 1, question: "What is Material Tailwind?", answer: "Material Tailwind is a component library for Tailwind CSS." },
    { id: 2, question: "How does it work?", answer: "It provides ready-to-use components styled with Tailwind CSS." },
    { id: 3, question: "Is it free to use?", answer: "Yes, Material Tailwind is open-source and free to use." },
    { id: 4, question: "Can I customize the styles?", answer: "Yes, you can extend or modify styles using Tailwind classes." },
    { id: 5, question: "Where can I learn more?", answer: "Visit the official Material Tailwind documentation." }
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