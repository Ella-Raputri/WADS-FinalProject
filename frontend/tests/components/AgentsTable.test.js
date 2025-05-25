// AgentsTable.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import '@testing-library/jest-dom';
import { AgentsTable } from "../../src/components/AgentsTable";

// Mock FilterAgent to control its behavior during tests
jest.mock("../../src/components/FilterAgent", () => (props) => {
  const { isOpen, onClose, onApply, currFilters } = props;

  if (!isOpen) return null;

  return (
    <div data-testid="filter-agent-modal">
      <button
        onClick={() =>
          onApply({
            status: "online",
            sort: "ascending",
          })
        }
      >
        Apply Filter
      </button>
      <button onClick={onClose}>Close</button>
      <div>Current status filter: {currFilters.status}</div>
      <div>Current sort filter: {currFilters.sort}</div>
    </div>
  );
});

const sampleData = [
  { name: "Agent A", tickets: 5, status: "Online" },
  { name: "Agent B", tickets: 10, status: "Offline" },
  { name: "Agent C", tickets: 7, status: "Online" },
];

describe("AgentsTable", () => {
  test("renders table with data", () => {
    render(<AgentsTable data={sampleData} />);

    // Check headers
    expect(screen.getByText(/Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Tickets Worked/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();

    // Check agents rendered
    expect(screen.getByText("Agent A")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    const row = screen.getByText("Agent A").closest("tr");
    expect(within(row).getByText("Online")).toBeInTheDocument();
  });

  test("opens and closes filter modal", () => {
    render(<AgentsTable data={sampleData} />);

    const filterButton = screen.getByRole("button");
    fireEvent.click(filterButton);

    // Modal should open
    expect(screen.getByTestId("filter-agent-modal")).toBeInTheDocument();

    // Close modal
    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    // Modal should be removed
    expect(screen.queryByTestId("filter-agent-modal")).not.toBeInTheDocument();
  });

  test("applies filter and sort correctly", async () => {
    render(<AgentsTable data={sampleData} />);

    // Open filter modal
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("filter-agent-modal")).toBeInTheDocument();

    // Apply filter by clicking "Apply Filter" button in mocked FilterAgent
    fireEvent.click(screen.getByText("Apply Filter"));

    // Modal closes after applying filter
    await waitFor(() => {
      expect(screen.queryByTestId("filter-agent-modal")).not.toBeInTheDocument();
    });

    // Only "Online" agents remain (Agent A and Agent C)
    expect(screen.queryByText("Agent B")).not.toBeInTheDocument();
    expect(screen.getByText("Agent A")).toBeInTheDocument();
    expect(screen.getByText("Agent C")).toBeInTheDocument();

    // Sorted ascending by tickets: Agent A (5) then Agent C (7)
    const rows = screen.getAllByRole("row");
    // The first row is the header, so rows[1] and rows[2] are data rows
    expect(rows[1]).toHaveTextContent("Agent A");
    expect(rows[2]).toHaveTextContent("Agent C");
  });

  test("updates filtered data when prop data changes", () => {
    const { rerender } = render(<AgentsTable data={sampleData} />);
    expect(screen.getByText("Agent A")).toBeInTheDocument();

    // Rerender with new data
    const newData = [
      { name: "Agent D", tickets: 3, status: "Online" },
      { name: "Agent E", tickets: 8, status: "Offline" },
    ];
    rerender(<AgentsTable data={newData} />);

    expect(screen.queryByText("Agent A")).not.toBeInTheDocument();
    expect(screen.getByText("Agent D")).toBeInTheDocument();
    expect(screen.getByText("Agent E")).toBeInTheDocument();
  });
});
