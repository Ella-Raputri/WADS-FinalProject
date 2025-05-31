import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import { StatusModal } from "../../src/components/StatusModal";
import { AppContent } from "@/context/AppContext"; // This will be mocked below
import Modal from "react-modal";
import '@testing-library/jest-dom'

jest.mock("axios");

// Setup react-modal app element to avoid warnings
Modal.setAppElement(document.createElement("div"));

// Mock AppContext as per your snippet
jest.mock("@/context/AppContext", () => {
  const React = require("react");
  return {
    AppContent: React.createContext(),
  };
});

// Helper render with context provider
const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AppContent.Provider value={providerProps}>{ui}</AppContent.Provider>,
    renderOptions
  );
};

describe("StatusModal", () => {
  const mockCompetition = { _id: "comp123" };
  const mockUserData = { id: "user123" };
  const backendUrl = "http://mock-backend/";

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock for axios.get to simulate "Rejected" status
    axios.get.mockResolvedValue({
      data: {
        success: true,
        newestRegistration: {
          Status: "Rejected",
          AdminComment: "Please upload again",
          PaymentProof: "payment.png",
          TwibbonProof: "twibbon.png",
        },
      },
    });
  });

  test("renders loading state initially", () => {
    renderWithContext(<StatusModal competition={mockCompetition} isOpen={true} onClose={jest.fn()} />, {
      providerProps: { userData: mockUserData, backendUrl },
    });
    // During loading, content not present
    expect(screen.queryByText("Competition Status")).not.toBeInTheDocument();
  });

  test("fetches and displays registration data", async () => {
    renderWithContext(<StatusModal competition={mockCompetition} isOpen={true} onClose={jest.fn()} />, {
      providerProps: { userData: mockUserData, backendUrl },
    });

    await waitFor(() => {
      expect(screen.getByText("Competition Status")).toBeInTheDocument();
    });

    expect(screen.getByText("Please upload again")).toBeInTheDocument();
    expect(screen.getByText("Rejected")).toHaveClass("text-red-500");
    expect(screen.getByAltText("Payment Proof Image")).toHaveAttribute("src", "payment.png");
    expect(screen.getByAltText("Twibbon Proof Image")).toHaveAttribute("src", "twibbon.png");
    expect(screen.getByRole("button", { name: /resubmit/i })).toBeInTheDocument();
  });

  test("does not show Resubmit button if status is not Rejected", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        success: true,
        newestRegistration: {
          Status: "Accepted",
          AdminComment: "",
          PaymentProof: "payment.png",
          TwibbonProof: "twibbon.png",
        },
      },
    });

    renderWithContext(<StatusModal competition={mockCompetition} isOpen={true} onClose={jest.fn()} />, {
      providerProps: { userData: mockUserData, backendUrl },
    });

    await waitFor(() => {
      expect(screen.getByText("Competition Status")).toBeInTheDocument();
    });

    expect(screen.queryByRole("button", { name: /resubmit/i })).not.toBeInTheDocument();
  });

  test("clicking close icon calls onClose", async () => {
    const onClose = jest.fn();
    renderWithContext(<StatusModal competition={mockCompetition} isOpen={true} onClose={onClose} />, {
      providerProps: { userData: mockUserData, backendUrl },
    });

    await waitFor(() => screen.getByText("Competition Status"));

    // The close icon is a span with onClick, query by role won't work; use getByRole for button or getByText for icon.
    const closeButton = screen.getByRole("button", { hidden: true }) || screen.getByText((content, element) =>
      element.tagName.toLowerCase() === "span" && content === ""
    );

    // Easier: query the close span by label text via aria-label or title if you add it, or fallback query by role="button" and alt text
    // Since none present, query by role of button next to heading:
    // But your close icon is a span with cursor pointer, not a button — so better to query by role "button" inside Modal or getByTestId

    // Let's query by role button "close-modal" by adding data-testid in your component
    // If not possible, use getByText for the FontAwesomeIcon aria-hidden text

    const closeSpan = screen.getByRole("button", { hidden: true }) || screen.getByText("×", { selector: "span" });

    // Because there is no role="button" on the close icon, let's query by label text or add data-testid in your component

    // Alternative: query by title or testId, or fallback query:
    const closeIcon = screen.getByRole("button", { hidden: true }) || screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === "span" && element.getAttribute("role") === null;
    });

    // Simplify by getting the span via the title or alt or className
    const closeIconSpan = screen.getByRole("button", { hidden: true }) || screen.getByText("", { selector: "span" });

    // Just query by the absolute position:
    const closeSpanAlt = screen.getByRole("button", { hidden: true });

    // Instead, let's directly query by the span and fire click event on it
    const closeSpanElement = screen.getByText((content, element) => element.tagName.toLowerCase() === "span" && element.className.includes("cursor-pointer"));

    fireEvent.click(closeSpanElement);

    expect(onClose).toHaveBeenCalled();
  });
});
