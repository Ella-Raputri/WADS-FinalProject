import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserData } from "@/components/UserData";

// Mock window.open and window.alert
global.open = jest.fn();
global.alert = jest.fn();

const dummyProps = {
  name: "John Doe",
  mandarinName: "约翰·多伊",
  DOB: "1990-01-01",
  gender: "Male",
  fullAddress: "123 Street, City",
  phoneNumber: "1234567890",
  email: "john@example.com",
  institution: "Example University",
  studentCardUrl: "http://example.com/student-card.jpg"
};

describe("UserData component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all user data fields correctly", () => {
    render(<UserData {...dummyProps} />);

    expect(screen.getByText("Name:")).toBeInTheDocument();
    expect(screen.getByText(dummyProps.name)).toBeInTheDocument();

    expect(screen.getByText("Mandarin Name:")).toBeInTheDocument();
    expect(screen.getByText(dummyProps.mandarinName)).toBeInTheDocument();

    expect(screen.getByText("Date of Birth:")).toBeInTheDocument();
    expect(screen.getByText(dummyProps.DOB)).toBeInTheDocument();

    expect(screen.getByText("Gender:")).toBeInTheDocument();
    expect(screen.getByText(dummyProps.gender)).toBeInTheDocument();

    expect(screen.getByText("Full Address:")).toBeInTheDocument();
    expect(screen.getByText(dummyProps.fullAddress)).toBeInTheDocument();

    expect(screen.getByText("Phone Number:")).toBeInTheDocument();
    expect(screen.getByText(dummyProps.phoneNumber)).toBeInTheDocument();

    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText(dummyProps.email)).toBeInTheDocument();

    expect(screen.getByText("Institution:")).toBeInTheDocument();
    expect(screen.getByText(dummyProps.institution)).toBeInTheDocument();
  });

  test("clicking 'See here' opens student card URL", () => {
    render(<UserData {...dummyProps} />);
    fireEvent.click(screen.getByText("See here"));
    expect(global.open).toHaveBeenCalledWith(dummyProps.studentCardUrl, "_blank");
  });

  test("clicking 'See here' shows alert if no studentCardUrl", () => {
    render(<UserData {...{ ...dummyProps, studentCardUrl: "" }} />);
    fireEvent.click(screen.getByText("See here"));
    expect(global.alert).toHaveBeenCalledWith("Student card not available.");
  });
});
