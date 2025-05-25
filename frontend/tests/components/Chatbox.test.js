import React from "react";
import { render, screen } from "@testing-library/react";
import ChatBox from "../../src/components/ChatBox";
import '@testing-library/jest-dom';

const baseMsg = {
  Message: "Who are you",
  createdAt: "2025-04-23T03:59:39.109Z",
  SenderId: {
    _id: "67ed1e7be368010fea9da469",
    FullName: "User A"
  },
  _id: "680865abeaf766cbbe3e1dae",
};

const user = {
  id: "67ed1e7be368010fea9da469",
  role: "user"
};

describe("ChatBox", () => {
  test("renders user message on 'ticketdetails' page", () => {
    render(<ChatBox msg={baseMsg} index={0} user={user} page="ticketdetails" />);
    expect(screen.getByText("Who are you")).toBeInTheDocument();
  });

  test("renders admin message on 'adminticketdetails' page", () => {
    const adminMsg = {
      ...baseMsg,
      Role: "admin",
      AdminId: "admin123",
      AdminName: "Admin John",
    };
    const adminUser = { id: "admin123", role: "admin" };

    render(<ChatBox msg={adminMsg} index={1} user={adminUser} page="adminticketdetails" />);
    expect(screen.getByText("Who are you")).toBeInTheDocument();
    expect(screen.getByText("Admin John")).toBeInTheDocument();
  });

  test("renders chatbot user message", () => {
    const chatbotMsg = {
      ...baseMsg,
      Role: "user"
    };
    render(<ChatBox msg={chatbotMsg} index={2} user={user} page="chatbot" />);
    expect(screen.getByText("Who are you")).toBeInTheDocument();
  });

  test("renders system message", () => {
    const systemMsg = {
      ...baseMsg,
      SenderId: { FullName: "System" }
    };
    render(<ChatBox msg={systemMsg} index={3} user={user} page="ticketdetails" />);
    expect(screen.getByText("Who are you")).toBeInTheDocument();
  });

  test("renders image if present", () => {
    const imageMsg = {
      ...baseMsg,
      Image: "https://example.com/image.png"
    };
    render(<ChatBox msg={imageMsg} index={4} user={user} page="ticketdetails" />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });
});
