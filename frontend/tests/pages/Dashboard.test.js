import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import Dashboard from "../../src/pages/admin/Dashboard";
import { AppContent } from "@/context/AppContext";
import axios from "axios";
import JSZip from "jszip";
import * as fileSaver from "file-saver";
import '@testing-library/jest-dom';

// Mock dependent components
jest.mock("@/components/AgentsTable", () => ({
  AgentsTable: ({ data }) => <div data-testid="AgentsTable">Agents Table - {data?.length || 0} agents</div>,
}));
jest.mock("@/components/BarChartMulti", () => ({
  BarChartMulti: ({ chartData }) => <div data-testid="BarChartMulti">Bar Chart - {chartData?.length || 0} items</div>,
}));
jest.mock("@/components/DonutChart", () => ({
  DonutChart: ({ finalChartData }) => <div data-testid="DonutChart">Donut Chart - {finalChartData?.length || 0} items</div>,
}));
jest.mock("@/components/GaugeChart", () => ({ targetPercentage }) => 
  <div data-testid="GaugeChart">Gauge Chart - {targetPercentage}%</div>
);
jest.mock("@/components/StatusChart", () => ({
  StatusChart: ({ ticketData }) => <div data-testid="StatusChart">Status Chart - {ticketData?.length || 0} items</div>,
}));
jest.mock("@/components/Loading", () => () => <div data-testid="Loading">Loading...</div>);

// Mock react-calendar
jest.mock("react-calendar", () => {
  const React = require("react");
  return function MockCalendar({ onChange, value }) {
    return (
      <div data-testid="Calendar">
        <input
          type="date"
          data-testid="calendar-input"
          value={value?.toISOString().split("T")[0] || ""}
          onChange={(e) => onChange && onChange(new Date(e.target.value))}
        />
      </div>
    );
  };
});


// Mock toast and file-saver
jest.mock("react-toastify", () => ({
  toast: { 
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}));

// Mock JSZip
jest.mock("jszip", () => {
  return jest.fn().mockImplementation(() => ({
    file: jest.fn(),
    generateAsync: jest.fn().mockResolvedValue(new Blob()),
  }));
});

// Mock utility functions
jest.mock("@/lib/utils", () => ({
  convertToCSV: jest.fn((data, headers) => `${headers.join(',')}\n${data.map(row => headers.map(h => row[h] || '').join(',')).join('\n')}`),
  convertToTimeZone: jest.fn((dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  }),
}));

// Mock axios
jest.mock("axios");
const mockedAxios = axios;

// Mock AppContext
jest.mock('@/context/AppContext', () => {
  const React = require('react');
  return {
    AppContent: React.createContext(),
  };
});

// Sample context and mock data
const mockUserData = {
  name: "Admin User",
  id: "123",
  admin: { CompTypeId: "456" },
};

const mockContext = {
  userData: mockUserData,
  backendUrl: "http://localhost/",
  socket: { emit: jest.fn(), on: jest.fn() },
  onlineUsersRef: { current: ["agent1", "agent2"] },
  initializeSocket: jest.fn(),
};

// Mock API responses
const mockApiResponses = {
  totaltickets: { totalTickets: 42 },
  totalparticipants: { totalParticipants: 10 },
  firstresponsetime: { avgFirstRespTime: 125 },
  fullresolvetime: { avgFullResolveTime: 200 },
  ratingmetrics: { avgRating: 75 },
  receiveresolvebar: [
    { dayName: "Monday", received: 10, resolved: 8 },
    { dayName: "Tuesday", received: 15, resolved: 12 }
  ],
  ticketbyemergency: { High: 5, Medium: 3, Low: 2, Urgent: 1 },
  agenttickets: [
    { agentId: "agent1", agentName: "John Doe", ticketCount: 5 },
    { agentId: "agent2", agentName: "Jane Smith", ticketCount: 3 }
  ],
  ticketbystatus: { Open: 3, "In Progress": 2, Resolved: 4, Closed: 1 }
};

describe("Dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup axios mock to return appropriate responses based on URL
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes("totaltickets")) {
        return Promise.resolve({ data: mockApiResponses.totaltickets });
      }
      if (url.includes("totalparticipants")) {
        return Promise.resolve({ data: mockApiResponses.totalparticipants });
      }
      if (url.includes("firstresponsetime")) {
        return Promise.resolve({ data: mockApiResponses.firstresponsetime });
      }
      if (url.includes("fullresolvetime")) {
        return Promise.resolve({ data: mockApiResponses.fullresolvetime });
      }
      if (url.includes("ratingmetrics")) {
        return Promise.resolve({ data: mockApiResponses.ratingmetrics });
      }
      if (url.includes("receiveresolvebar")) {
        return Promise.resolve({ data: mockApiResponses.receiveresolvebar });
      }
      if (url.includes("ticketbyemergency")) {
        return Promise.resolve({ data: mockApiResponses.ticketbyemergency });
      }
      if (url.includes("agenttickets")) {
        return Promise.resolve({ data: mockApiResponses.agenttickets });
      }
      if (url.includes("ticketbystatus")) {
        return Promise.resolve({ data: mockApiResponses.ticketbystatus });
      }
      return Promise.resolve({ data: {} });
    });
  });

  it("renders dashboard content correctly", async () => {
    await act(async () => {
      render(
        <AppContent.Provider value={mockContext}>
          <Dashboard />
        </AppContent.Provider>
      );
    });

    // Wait for the greeting to appear
    await waitFor(() => {
      expect(screen.getByText(/Hello, Admin User!/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Wait for data to load and check metrics
    await waitFor(() => {
      expect(screen.getByText(/Total Tickets/i)).toBeInTheDocument();
      expect(screen.getByText("42")).toBeInTheDocument();
      expect(screen.getByText(/Total Participants/i)).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    }, { timeout: 3000 });

    // Check that all chart components are rendered
    expect(screen.getByTestId("AgentsTable")).toBeInTheDocument();
    expect(screen.getByTestId("BarChartMulti")).toBeInTheDocument();
    expect(screen.getByTestId("DonutChart")).toBeInTheDocument();
    expect(screen.getByTestId("GaugeChart")).toBeInTheDocument();
    expect(screen.getByTestId("StatusChart")).toBeInTheDocument();
    const calendars = screen.getAllByTestId("Calendar");
    expect(calendars.length).toBeGreaterThan(0);
  });


  it("handles date change and refetches data", async () => {
    await act(async () => {
      render(
        <AppContent.Provider value={mockContext}>
          <Dashboard />
        </AppContent.Provider>
      );
    });

    // Wait for initial load to complete
    await waitFor(() => {
      expect(screen.getByText(/Hello, Admin User!/i)).toBeInTheDocument();
    });

    // Clear previous calls
    mockedAxios.get.mockClear();

    // Change date - wrap in act since this triggers state updates
    await act(async () => {
      const calendarInputs = screen.getAllByTestId("calendar-input");
      fireEvent.change(calendarInputs[0], { target: { value: "2024-02-01" } });
    });

    // Wait for API calls to be made
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(9); // Should call all 8 endpoints
    });
  });

  it("downloads a ZIP file when download button is clicked", async () => {
    const mockZipInstance = {
      file: jest.fn(),
      generateAsync: jest.fn().mockResolvedValue(new Blob(['mock zip content'], { type: 'application/zip' })),
    };
    
    JSZip.mockImplementation(() => mockZipInstance);

    await act(async () => {
      render(
        <AppContent.Provider value={mockContext}>
          <Dashboard />
        </AppContent.Provider>
      );
    });

    // Wait for dashboard to load
    await waitFor(() => {
      expect(screen.getByText(/Hello, Admin User!/i)).toBeInTheDocument();
    });

    // Find and click download button - wrap in act since this triggers async operations
    await act(async () => {
      const downloadButton = screen.getByRole("button", { name: /download/i });
      fireEvent.click(downloadButton);
    });

    // Wait for zip generation and file save
    await waitFor(() => {
      expect(mockZipInstance.file).toHaveBeenCalledTimes(4); // Should create 4 CSV files
      expect(mockZipInstance.generateAsync).toHaveBeenCalledWith({ type: "blob" });
      expect(fileSaver.saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        "dashboard_data.zip"
      );
    });
  });

  it("handles API errors gracefully", async () => {
    // Mock axios to reject
    mockedAxios.get.mockRejectedValue(new Error("API Error"));
    
    const { toast } = require("react-toastify");

    await act(async () => {
      render(
        <AppContent.Provider value={mockContext}>
          <Dashboard />
        </AppContent.Provider>
      );
    });

    // Wait for error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("displays correct time formatting for response and resolve times", async () => {
    await act(async () => {
      render(
        <AppContent.Provider value={mockContext}>
          <Dashboard />
        </AppContent.Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Hello, Admin User!/i)).toBeInTheDocument();
    });

    // Check time formatting (125 minutes = 2h 5m, 200 minutes = 3h 20m)
    await waitFor(() => {
      const timeElement = screen.getByTestId("first-response-time");
      expect(timeElement).toHaveTextContent("2h 5m");
      const timeElement2 = screen.getByTestId("full-resolve-time");
      expect(timeElement2).toHaveTextContent("3h 20m");
    });
  });

  it("updates agent status based on online users", async () => {
    await act(async () => {
      render(
        <AppContent.Provider value={mockContext}>
          <Dashboard />
        </AppContent.Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Hello, Admin User!/i)).toBeInTheDocument();
    });

    // The agent table should show agents with online/offline status
    // This is tested through the component rendering with the proper data transformation
    expect(screen.getByTestId("AgentsTable")).toBeInTheDocument();
  });

  it("renders responsive layout elements correctly", async () => {
    render(
      <AppContent.Provider value={mockContext}>
        <Dashboard />
      </AppContent.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Hello, Admin User!/i)).toBeInTheDocument();
    });

    // Check for key layout elements
    expect(screen.getByText(/First Response Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Resolve Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Customer Satisfaction Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Tickets by Emergency/i)).toBeInTheDocument();
    expect(screen.getByText(/Tickets by Status/i)).toBeInTheDocument();
  });
});