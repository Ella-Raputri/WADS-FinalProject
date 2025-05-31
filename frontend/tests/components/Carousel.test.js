import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Carousel from "../../src/components/Carousel";

// Mock Swiper styles 
jest.mock("swiper/css", () => {});
jest.mock("swiper/css/navigation", () => {});
jest.mock("swiper/react", () => {
  const React = require("react");
  return {
    Swiper: ({ children }) => <div data-testid="mock-swiper">{children}</div>,
    SwiperSlide: ({ children }) => <div data-testid="mock-slide">{children}</div>,
  };
});
jest.mock("swiper/modules", () => ({
  Navigation: {},
}));

describe("Carousel", () => {
  test("renders all slides with images and titles", () => {
    render(<Carousel />);

    // Should render 4 slides
    const slides = screen.getAllByTestId("mock-slide");
    expect(slides).toHaveLength(6);

    // Check that each slide's title is in the document
    expect(screen.getByText("Junior Singing")).toBeInTheDocument();
    expect(screen.getByText("Senior Singing")).toBeInTheDocument();
    expect(screen.getByText("Storytelling")).toBeInTheDocument();
    expect(screen.getByText("Speech")).toBeInTheDocument();
    expect(screen.getByText("Poster Design")).toBeInTheDocument();
    expect(screen.getByText("Dubbing")).toBeInTheDocument();

    // Check that navigation buttons are in the DOM
    expect(document.querySelector(".swiper-button-prev")).toBeInTheDocument();
    expect(document.querySelector(".swiper-button-next")).toBeInTheDocument();
  });
});
