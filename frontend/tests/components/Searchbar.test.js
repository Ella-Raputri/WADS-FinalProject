import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../../src/components/SearchBar";
import '@testing-library/jest-dom';

describe("SearchBar", () => {
  test("renders input with placeholder", () => {
    render(<SearchBar onApply={jest.fn()} placeholderSubject="Search here..." />);
    expect(screen.getByPlaceholderText("Search here...")).toBeInTheDocument();
  });

  test("shows search icon initially", () => {
    render(<SearchBar onApply={jest.fn()} placeholderSubject="Search" />);
    expect(screen.getByRole("button")).toContainHTML("svg"); // FontAwesomeIcon renders an svg
  });

  test("typing input calls onApply with input value", () => {
    const onApplyMock = jest.fn();
    render(<SearchBar onApply={onApplyMock} placeholderSubject="Search" />);

    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "hello" } });

    // Because of useEffect, onApply called with "hello"
    expect(onApplyMock).toHaveBeenCalledWith("hello");
  });

  test("button shows ✖ when input is not empty", () => {
    render(<SearchBar onApply={jest.fn()} placeholderSubject="Search" />);

    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "test" } });

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("✖");
  });

  test("clicking button clears input and calls onApply with empty string", () => {
    const onApplyMock = jest.fn();
    render(<SearchBar onApply={onApplyMock} placeholderSubject="Search" />);

    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "test" } });

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(input).toHaveValue("");
    expect(onApplyMock).toHaveBeenCalledWith("");
  });

  test("does not call onApply on initial render", () => {
    const onApplyMock = jest.fn();
    render(<SearchBar onApply={onApplyMock} placeholderSubject="Search" />);
    expect(onApplyMock).not.toHaveBeenCalled();
  });
});
