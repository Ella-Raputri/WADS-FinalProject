import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { StatusChart } from "../../src/components/StatusChart";

// Mock framer-motion's motion.div and useInView
jest.mock("framer-motion", () => {
  const originalModule = jest.requireActual("framer-motion");
  return {
    ...originalModule,
    useInView: () => true, // Always in view during test
    motion: {
      div: ({ children, className }) => (
        <div className={className} data-testid="motion-bar">{children}</div>
      ),
    },
  };
});

const mockTicketData = [
  { status: "Open", count: 5, width: "50%", color: "bg-red-500" },
  { status: "In Progress", count: 3, width: "30%", color: "bg-yellow-500" },
  { status: "Closed", count: 12, width: "80%", color: "bg-green-500" },
];

describe("StatusChart", () => {
  test("renders status and count labels correctly", () => {
    render(<StatusChart ticketData={mockTicketData} />);

    mockTicketData.forEach((ticket) => {
      expect(screen.getByText(ticket.status)).toBeInTheDocument();
      expect(screen.getByText(ticket.count.toString())).toBeInTheDocument();
    });
  });

  test("renders motion bars with correct classes and count", () => {
    render(<StatusChart ticketData={mockTicketData} />);

    const bars = screen.getAllByTestId("motion-bar");
    expect(bars).toHaveLength(mockTicketData.length);

    bars.forEach((bar, i) => {
        expect(bar).toHaveClass(mockTicketData[i].color);
    });
  });
});
