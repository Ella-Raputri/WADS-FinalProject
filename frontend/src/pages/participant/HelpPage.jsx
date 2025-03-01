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
    <div className="w-full min-h-screen p-4 mt-15">
      <AccordionFAQ></AccordionFAQ>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Help Page</h2>
      <Table columns={cols} data={data} />
      
      {/* Now the FontAwesome icon will work */}
      <h1>Enjoy your coffee! <FontAwesomeIcon icon={faCoffee} className="text-brown-500 text-2xl" /></h1>
    </div>
  );
};

export default HelpPage;
