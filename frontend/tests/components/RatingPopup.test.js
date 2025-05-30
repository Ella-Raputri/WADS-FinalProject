import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RatingPopup from "../../src/components/RatingPopup";
import { AppContent } from "@/context/AppContext";
import Modal from "react-modal";
import axios from "axios";
import { toast } from "react-toastify";
import '@testing-library/jest-dom'

// Mocks
jest.mock("axios");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

beforeAll(() => {
  Modal.setAppElement(document.createElement("div")); // Prevent modal warning
});

const mockTicket = {
  _id: "123",
  HandledBy: "admin123"
};

jest.mock('@/context/AppContext', () => {
  const React = require('react');
  return {
    AppContent: React.createContext(),
  };
});


// const backendUrl ='http://localhost:3000'

const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AppContent.Provider value={providerProps}>{ui}</AppContent.Provider>,
    renderOptions
  );
};


describe("RatingPopup", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the modal when open", () => {
    renderWithContext(
      <RatingPopup
        isOpen={true}
        onClose={jest.fn()}
        ticket={mockTicket}
        isDone={false}
        ratingResult={null}
      />,
      { providerProps: { backendUrl: "http://localhost:3000/" } }
    );

    expect(screen.getByText("Ticket Rating")).toBeInTheDocument();
    expect(screen.getByText("How was the service you received?")).toBeInTheDocument();
  });

  test("displays all rating options", () => {
    renderWithContext(
      <RatingPopup
        isOpen={true}
        onClose={jest.fn()}
        ticket={mockTicket}
        isDone={false}
        ratingResult={null}
      />,
      { providerProps: { backendUrl: "http://localhost:3000/" } }
    );

    expect(screen.getByText("Terrible")).toBeInTheDocument();
    expect(screen.getByText("Excellent")).toBeInTheDocument();
  });

  test("handles rating selection and submission", async () => {
    const mockOnClose = jest.fn();

    axios.post.mockResolvedValue({
      data: { success: true, message: "Rating submitted!" }
    });

    renderWithContext(
      <RatingPopup
        isOpen={true}
        onClose={mockOnClose}
        ticket={mockTicket}
        isDone={false}
        ratingResult={null}
      />,
      { providerProps: { backendUrl: "http://localhost:3000/" } }
    );

    fireEvent.click(screen.getByText("Good"));
    fireEvent.change(screen.getByPlaceholderText(/Type your comments/i), {
      target: { value: "Great job!" }
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3000/api/ticket/rateTicket",
        expect.objectContaining({
          ticketId: "123",
          adminId: "admin123",
          rating: 4,
          comment: "Great job!"
        })
      );
      expect(toast.success).toHaveBeenCalledWith("Rating submitted!");
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("shows error toast if submission fails", async () => {
    axios.post.mockResolvedValue({ data: { success: false, message: "Failed to submit" } });

    renderWithContext(
      <RatingPopup
        isOpen={true}
        onClose={jest.fn()}
        ticket={mockTicket}
        isDone={false}
        ratingResult={null}
      />,
      { providerProps: { backendUrl: "http://localhost:3000/" } }
    );

    fireEvent.click(screen.getByText("Good"));
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to submit");
    });
  });

  test("renders in readonly mode when isDone is true", () => {
    renderWithContext(
      <RatingPopup
        isOpen={true}
        onClose={jest.fn()}
        ticket={mockTicket}
        isDone={true}
        ratingResult={{ Rating: 5, Comment: "Amazing service!" }}
      />,
      { providerProps: { backendUrl: "http://localhost:3000/" } }
    );

    expect(screen.getByText("Excellent")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Amazing service!")).toBeDisabled();
    expect(screen.queryByText("Submit")).not.toBeInTheDocument();
  });
});
