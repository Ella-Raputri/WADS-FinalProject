// GaugeChart.test.jsx
import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import GaugeChart from "../../src/components/GaugeChart";

// Mock IntersectionObserver to simulate chart being in view
beforeEach(() => {
  global.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe = () => {
      this.callback([{ isIntersecting: true }]); // Simulate visible
    };
    unobserve = () => {};
    disconnect = () => {};
  };

  // Fake requestAnimationFrame
  global.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 10);
  global.cancelAnimationFrame = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("GaugeChart", () => {
  test("renders component with 0% initially", () => {
    render(<GaugeChart targetPercentage={60} />);
    expect(screen.getByText(/%/)).toBeInTheDocument();
  });

  test("animates to targetPercentage when in view", async () => {
    jest.useFakeTimers();
    render(<GaugeChart targetPercentage={70} />);

    act(() => {
      jest.advanceTimersByTime(1600); // Advance animation duration
    });

    expect(screen.getByText("70%")).toBeInTheDocument();
    jest.useRealTimers();
  });

  test("does not animate when not visible", () => {
    // Simulate component NOT visible in viewport
    global.IntersectionObserver = class {
      constructor(callback) {
        this.callback = callback;
      }
      observe = () => {
        this.callback([{ isIntersecting: false }]);
      };
      unobserve = () => {};
    };

    render(<GaugeChart targetPercentage={85} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });
});
