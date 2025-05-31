import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { BarChartMulti } from "../../src/components/BarChartMulti";

// Mock framer-motion's useInView to always return true
jest.mock("framer-motion", () => {
  const actual = jest.requireActual("framer-motion");
  return {
    ...actual,
    useInView: () => true,
    motion: {
      ...actual.motion,
      div: ({ children, ...rest }) => <div {...rest}>{children}</div>,
    },
  };
});

const mockData = [
  { date: "05-25", received: 120, resolved: 100 },
  { date: "05-26", received: 120, resolved: 100 },
  { date: "05-27", received: 120, resolved: 100 },
  { date: "05-28", received: 120, resolved: 100 },
  { date: "05-29", received: 120, resolved: 100 },
  { date: "05-30", received: 120, resolved: 100 },
  { date: "05-31", received: 120, resolved: 100 },
];

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("BarChartMulti", () => {
  test("renders chart when in view", () => {
    const { container } = render(<BarChartMulti chartData={mockData} />);
    const chartWrapper = screen.getByTestId("chart-wrapper");
    expect(chartWrapper).toBeInTheDocument();
  });
});
