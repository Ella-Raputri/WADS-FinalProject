// Footer.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import Footer from '../../src/components/Footer';

describe("Footer component", () => {
  beforeEach(() => {
    render(<Footer />);
  });

  test("renders copyright text", () => {
    expect(screen.getByText(/© Copyright 2025 Group Raft & NMC/i)).toBeInTheDocument();
  });

  test("renders Instagram link", () => {
    const instagramLink = screen.getByRole("link", { name: /instagram/i });
    expect(instagramLink).toHaveAttribute("href", "https://www.instagram.com/nmcbnmc/");
    expect(instagramLink).toHaveAttribute("target", "_blank");
    expect(instagramLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("renders mail link", () => {
    const mailLink = screen.getByRole("link", { name: /mail/i });
    expect(mailLink).toHaveAttribute("href", "mailto:ellarworkingfolder@gmail.com");
    expect(mailLink).toHaveAttribute("target", "_blank");
    expect(mailLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("renders YouTube link", () => {
    const youtubeLink = screen.getByRole("link", { name: /youtube/i });
    expect(youtubeLink).toHaveAttribute("href", "https://www.youtube.com/@NMCBNMC");
    expect(youtubeLink).toHaveAttribute("target", "_blank");
    expect(youtubeLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("renders TikTok link", () => {
    const tiktokLink = screen.getByRole("link", { name: /tiktok/i });
    expect(tiktokLink).toHaveAttribute("href", "https://www.tiktok.com/@nmcbnmc");
    expect(tiktokLink).toHaveAttribute("target", "_blank");
    expect(tiktokLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
