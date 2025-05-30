import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterStatusModal from "../../src/components/FilterStatusModal";
import '@testing-library/jest-dom'

describe("FilterStatusModal", () => {
  const onClose = jest.fn();
  const onApply = jest.fn();

  const renderModal = (isOpen = true) => {
    render(
      <FilterStatusModal isOpen={isOpen} onClose={onClose} onApply={onApply} />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the modal when open", () => {
    renderModal();
    expect(screen.getByText(/filter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /apply/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
  });

  test("lets user select status and applies filter", () => {
    renderModal();

    fireEvent.change(screen.getByLabelText(/status/i), {
      target: { value: "pending" },
    });

    fireEvent.click(screen.getByRole("button", { name: /apply/i }));

    expect(onApply).toHaveBeenCalledWith({ status: "pending" });
    expect(onClose).toHaveBeenCalled();
  });

  test("resets status when clicking reset", () => {
    renderModal();

    const statusSelect = screen.getByLabelText(/status/i);

    fireEvent.change(statusSelect, {
      target: { value: "accepted" },
    });

    expect(statusSelect.value).toBe("accepted");

    fireEvent.click(screen.getByRole("button", { name: /reset/i }));

    expect(statusSelect.value).toBe(""); // Reset to default
  });

  test("does not render modal when isOpen is false", () => {
    renderModal(false);
    expect(screen.queryByText(/filter/i)).not.toBeInTheDocument();
  });
});
