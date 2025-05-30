// tests/components/Table.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Table from "../../src/components/Table";  // adjust path if needed
import { AppContent } from "../../src/context/AppContext";
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom'

// Mock useNavigate from react-router-dom
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("@/context/AppContext", () => {
  const React = require("react");
  return {
    AppContent: React.createContext(),
  };
});

const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <BrowserRouter>
      <AppContent.Provider value={providerProps}>{ui}</AppContent.Provider>
    </BrowserRouter>,
    renderOptions
  );
};

describe("Table component", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  const columnsTicket = ["SUBJECT", "PRIORITY", "STATUS", "CREATED AT", "UPDATED AT"];
  const dataTicket = [
    {
      Subject: "Issue 1",
      PriorityType: "Urgent",
      Status: "Open",
      CreatedAt: "2025-05-01T12:00:00Z",
      UpdatedAt: "2025-05-02T12:00:00Z",
    },
  ];

  const columnsNonTicket = ["NAME", "EMAIL", "STATUS", "PHONE NUMBER"];
  const dataNonTicket = [
    {
      userDetails: {
        FullName: "John Doe",
        Email: "john@example.com",
        PhoneNumber: "1234567890",
      },
      Status: "Closed",
    },
  ];

  test("renders ticket table with correct data and styles", () => {
    renderWithContext(<Table columns={columnsTicket} data={dataTicket} isTicketTable={true} />, {
      providerProps: { userData: { role: "participant" } },
    });

    expect(screen.getByText("Issue 1")).toBeInTheDocument();
    expect(screen.getByText("Urgent")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();

    // Priority dot color check: red for Urgent
    const priorityDot = screen.getByTestId('urgent')
    expect(priorityDot).toHaveClass("bg-red-600");
  });

  test("renders non-ticket table with user details", () => {
    renderWithContext(<Table columns={columnsNonTicket} data={dataNonTicket} isTicketTable={false} />, {
      providerProps: { userData: { role: "admin" } },
    });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Closed")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
  });

  test("navigates to user ticket details page on subject click for participant role", () => {
    renderWithContext(<Table columns={columnsTicket} data={dataTicket} isTicketTable={true} />, {
      providerProps: { userData: { role: "participant" } },
    });

    // The external link icon triggers navigation
    const icon = screen.getByRole("img", { hidden: true }) || screen.getByText((content, element) => element.tagName.toLowerCase() === 'svg');

    fireEvent.click(icon);

    expect(mockedNavigate).toHaveBeenCalledWith(
      "/userticketdetails",
      expect.objectContaining({
        state: expect.objectContaining({ data: dataTicket[0], user: { role: "participant" } }),
      })
    );
  });

  test("navigates to admin ticket details page on subject click for admin role", () => {
    renderWithContext(<Table columns={columnsTicket} data={dataTicket} isTicketTable={true} />, {
      providerProps: { userData: { role: "admin" } },
    });

    const icon = screen.getByRole("img", { hidden: true }) || screen.getByText((content, element) => element.tagName.toLowerCase() === 'svg');
    fireEvent.click(icon);

    expect(mockedNavigate).toHaveBeenCalledWith(
      "/adminticketdetails",
      expect.objectContaining({
        state: expect.objectContaining({ data: dataTicket[0], user: { role: "admin" } }),
      })
    );
  });

  test("navigates to admin participant details page on NAME column click", () => {
    const columns = ["NAME", "STATUS"];
    const data = [{ userDetails: { FullName: "Jane Doe" , Status:'Open'} }];
    renderWithContext(<Table columns={columns} data={data} isTicketTable={false} />, {
      providerProps: { userData: { role: "admin" } },
    });

    // The external link icon triggers navigation
    const icon = screen.getByRole("img", { hidden: true }) || screen.getByText((content, element) => element.tagName.toLowerCase() === 'svg');
    fireEvent.click(icon);

    expect(mockedNavigate).toHaveBeenCalledWith(
      "/adminparticipantdetails",
      expect.objectContaining({
        state: { data: data[0] },
      })
    );
  });
});
