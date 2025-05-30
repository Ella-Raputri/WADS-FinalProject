import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputField from "../../src/components/InputField";
import '@testing-library/jest-dom'

describe("InputField", () => {
  const defaultProps = {
    id: "email",
    type: "text",
    value: "",
    onChange: jest.fn(),
    placeholder: "Enter email",
    onKeyDown: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with correct label based on id", () => {
    render(<InputField {...defaultProps} />);
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
  });

  test("renders 'Full Name' label when id is 'fullName'", () => {
    render(<InputField {...defaultProps} id="fullName" />);
    expect(screen.getByText(/Full Name/i)).toBeInTheDocument();
  });

  test("renders 'Mandarin Name' label when id is 'mandarinName'", () => {
    render(<InputField {...defaultProps} id="mandarinName" />);
    expect(screen.getByText(/Mandarin Name/i)).toBeInTheDocument();
  });

  test("handles input change", () => {
    render(<InputField {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
      target: { value: "test@example.com" },
    });
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  test("handles key down event", () => {
    render(<InputField {...defaultProps} />);
    fireEvent.keyDown(screen.getByPlaceholderText(/enter email/i), {
      key: "Enter",
      code: "Enter",
    });
    expect(defaultProps.onKeyDown).toHaveBeenCalled();
  });

  test("renders input with correct type and placeholder", () => {
    render(<InputField {...defaultProps} type="password" placeholder="Enter password" />);
    const input = screen.getByPlaceholderText(/Enter password/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");
  });
});
