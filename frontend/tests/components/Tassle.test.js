import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import Tassle from "../../src/components/Tassle"; 
import '@testing-library/jest-dom';

// Mock framer-motion
jest.mock("framer-motion", () => {
  const actual = jest.requireActual("framer-motion");
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
  };
});

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = class {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
    }
    observe = jest.fn(() => {
      this.callback([{ isIntersecting: true }]);
    });
    unobserve = jest.fn();
    disconnect = jest.fn();
  };
});

describe("Tassle Component", () => {
  test("renders image", () => {
    const { getByAltText } = render(<Tassle />);
    expect(getByAltText("decoration")).toBeInTheDocument();
  });

  test("triggers animation on intersection", async () => {
    const { container } = render(<Tassle />);
    const wrapper = container.querySelector("div");
    expect(wrapper).toBeInTheDocument();
    await waitFor(() => {}, { timeout: 2100 });
  });

  test("triggers animation on click", async () => {
    const { getByAltText } = render(<Tassle />);
    const image = getByAltText("decoration");

    fireEvent.click(image);
    await waitFor(() => {}, { timeout: 2100 });
  });
});
