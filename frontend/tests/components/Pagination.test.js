import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../../src/components/Pagination";
import '@testing-library/jest-dom'

describe("Pagination Component", () => {
  const mockOnPageChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders all page numbers when totalPages <= 5", () => {
    render(<Pagination currentPage={2} totalPages={4} onPageChange={mockOnPageChange} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.queryByText("...")).not.toBeInTheDocument();
  });

  test("renders ellipsis when totalPages > 5 and currentPage is near start", () => {
    render(<Pagination currentPage={2} totalPages={10} onPageChange={mockOnPageChange} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("...")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  test("renders ellipsis when currentPage is near end", () => {
    render(<Pagination currentPage={9} totalPages={10} onPageChange={mockOnPageChange} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("...")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  test("renders middle ellipsis when currentPage is in the middle", () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getAllByText("...").length).toBeGreaterThan(1);
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  test("calls onPageChange with previous page", () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);
    fireEvent.click(screen.getByText(/← Previous/i));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  test("calls onPageChange with next page", () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);
    fireEvent.click(screen.getByText(/Next →/i));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  test("disables Previous button on first page", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);
    expect(screen.getByText(/← Previous/i)).toBeDisabled();
  });

  test("disables Next button on last page", () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={mockOnPageChange} />);
    expect(screen.getByText(/Next →/i)).toBeDisabled();
  });

  test("clicking a numbered button triggers onPageChange", () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);
    fireEvent.click(screen.getByText("4"));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  test("does not trigger onPageChange when clicking on ellipsis", () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />);
    const ellipsisButtons = screen.getAllByText("...");
    ellipsisButtons.forEach((ellipsis) => {
      fireEvent.click(ellipsis);
    });
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });
});
