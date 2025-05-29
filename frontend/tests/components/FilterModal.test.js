// FilterModal.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FilterModal from "../../src/components/FilterModal";
import { toast } from "react-toastify";
import '@testing-library/jest-dom'

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("FilterModal", () => {
  const defaultFilters = {
    createdStart: "",
    createdEnd: "",
    updatedStart: "",
    updatedEnd: "",
    priority: "",
    status: "",
    sortMethod: "",
    sortBy: "",
  };

  const onClose = jest.fn();
  const onApply = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders when open", () => {
    render(
      <FilterModal
        isOpen={true}
        onClose={onClose}
        onApply={onApply}
        currFilters={defaultFilters}
      />
    );
    expect(screen.getByText(/filter/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /apply/i })).toBeInTheDocument();
  });

  test("does not render when closed", () => {
    const { queryByText } = render(
      <FilterModal
        isOpen={false}
        onClose={onClose}
        onApply={onApply}
        currFilters={defaultFilters}
      />
    );
    expect(queryByText(/filter/i)).not.toBeInTheDocument();
  });

  test("reset button clears all filters", () => {
    render(
      <FilterModal
        isOpen={true}
        onClose={onClose}
        onApply={onApply}
        currFilters={{
          ...defaultFilters,
          priority: "high",
          status: "open",
          sortMethod: "asc",
          sortBy: "Subject",
        }}
      />
    );

    // Before reset
    expect(screen.getByDisplayValue("High")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Open")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Reset/i }));

    // After reset, inputs should have empty values
    expect(screen.getByDisplayValue("Select Priority")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Select Status")).toBeInTheDocument();
  });

  test("shows error toast if createdStart is set but createdEnd is empty", async () => {
    render(
      <FilterModal
        isOpen={true}
        onClose={onClose}
        onApply={onApply}
        currFilters={defaultFilters}
      />
    );

    // Set only createdStart
    const createdStartInput = screen.getByTestId("createdStart");
    fireEvent.change(createdStartInput, { target: { value: "2023-01-01" } });

    fireEvent.click(screen.getByRole("button", { name: /apply/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Please select both start and end dates for the creation time."
      );
    });

    expect(onApply).not.toHaveBeenCalled();
  });

  test("calls onApply with filters and onClose when valid inputs applied", () => {
    render(
      <FilterModal
        isOpen={true}
        onClose={onClose}
        onApply={onApply}
        currFilters={defaultFilters}
      />
    );

    // Set valid createdStart and createdEnd
    fireEvent.change(screen.getByTestId("createdStart"), {
      target: { value: "2025-05-12" },
    });
    fireEvent.change(screen.getByTestId("createdEnd"), {
      target: { value: "2025-05-16" },
    });

    fireEvent.click(screen.getByRole("button", { name: /apply/i }));

    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({
        createdStart: "2025-05-12",
        createdEnd: "2025-05-16",
      })
    );
    expect(onClose).toHaveBeenCalled();
  });
});
