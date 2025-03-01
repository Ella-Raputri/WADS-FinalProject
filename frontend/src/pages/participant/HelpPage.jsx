import React from 'react';
import Table from '../../components/Table';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the FontAwesome component
import { faCoffee } from "@fortawesome/free-solid-svg-icons"; // Import the specific icon
import AccordionFAQ from '../../components/AccordionFAQ';

const HelpPage = () => {
  const cols = ["SUBJECT", "CREATED AT", "UPDATED AT", "PRIORITY", "STATUS"];
  const data = [
    {
      subject: "Fix login issue",
      created_at: "2024-02-28",
      updated_at: "2024-02-28",
      priority: "High",
      status: "Open",
    },
    {
      subject: "Update dashboard UI",
      created_at: "2024-02-27",
      updated_at: "2024-02-28",
      priority: "Medium",
      status: "In Progress",
    },
    {
      subject: "Optimize database queries",
      created_at: "2024-02-26",
      updated_at: "2024-02-27",
      priority: "Low",
      status: "Closed",
    },
    {
      subject: "Cannot connect",
      created_at: "2024-02-26",
      updated_at: "2024-02-27",
      priority: "Urgent",
      status: "Resolved",
    },
  ];

  return (
    <>
    <h1 className='mt-20 font-medium text-3xl font-kanit p-5 pb-3'>
      Frequently Asked Questions (FAQ)
    </h1>
    <div className=' p-5 pt-3 max-w-2xl font-poppins font-medium'>
      <AccordionFAQ></AccordionFAQ>
    </div>

    <h1 className='mt-10 font-medium text-3xl font-kanit p-5 pb-0'>
      Help Tickets
    </h1>
    <div className='inline-flex'>
      <h3>Showing all ticker</h3>

      <div>
        <div className='bg-amber-300'>dd</div>
      </div>
    </div>

    <div className="w-full min-h-screen p-4 pl-0">
      <Table columns={cols} data={data} />
      
      {/* Now the FontAwesome icon will work */}
      <h1>Enjoy your coffee! <FontAwesomeIcon icon={faCoffee} className="text-brown-500 text-2xl" /></h1>
    </div>
    </>
  );
};

export default HelpPage;
