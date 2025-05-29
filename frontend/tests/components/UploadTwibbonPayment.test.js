import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UploadTwibbonPayment from "@/components/UploadTwibbonPayment";
import { AppContent } from "@/context/AppContext";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import '@testing-library/jest-dom'

// Mock AppContext
jest.mock("@/context/AppContext", () => {
  const React = require("react");
  return {
    AppContent: React.createContext(),
  };
});

// Mock axios
jest.mock("axios");

// Mock toast
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
}));

// Setup helper for rendering with context
const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <BrowserRouter>
      <AppContent.Provider value={providerProps}>{ui}</AppContent.Provider>
    </BrowserRouter>,
    renderOptions
  );
};

describe("UploadTwibbonPayment Component", () => {
  const providerProps = {
    userData: { id: "123" },
    backendUrl: "https://mock.api/",
    uploadImage: jest.fn((img) => Promise.resolve("https://mock.image.url")),
  };

  const competition = {
    _id: "comp123",
    name: "Mock Competition",
  };

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onCloseParent: jest.fn(),
    competition,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal and handles submit", async () => {
    axios.post.mockResolvedValue({ data: { success: true } });

    renderWithContext(<UploadTwibbonPayment {...defaultProps} />, {
      providerProps,
    });

    // Check UI renders
    expect(screen.getByText(/Upload Twibbon/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Payment Proof/i)).toBeInTheDocument();

    // Simulate image upload states manually
    fireEvent.click(screen.getByText(/Submit/i));

    // It should call uploadImage twice and post the form
    await waitFor(() => {
      expect(providerProps.uploadImage).toHaveBeenCalledTimes(2);
      expect(axios.post).toHaveBeenCalledWith(
        "https://mock.api/api/competitionRegistration/registerCompetition",
        expect.objectContaining({
          UserId: "123",
          CompetitionId: "comp123",
          PaymentProofUrl: "https://mock.image.url",
          TwibbonProofUrl: "https://mock.image.url",
        })
      );
      expect(toast.success).toHaveBeenCalledWith("Registration completed!");
      expect(defaultProps.onClose).toHaveBeenCalled();
      expect(defaultProps.onCloseParent).toHaveBeenCalled();
    });
  });

  it("does not submit if image upload fails", async () => {
    const failedUploadProvider = {
      ...providerProps,
      uploadImage: jest.fn(() => Promise.resolve("")),
    };

    renderWithContext(<UploadTwibbonPayment {...defaultProps} />, {
      providerProps: failedUploadProvider,
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(failedUploadProvider.uploadImage).toHaveBeenCalled();
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

});
