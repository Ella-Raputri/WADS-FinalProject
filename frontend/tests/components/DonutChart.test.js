import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DonutChart } from '../../src/components/DonutChart';

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

class IntersectionObserverMock {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }
  observe = () => {
    this.callback([{ isIntersecting: true }]);
  };
  unobserve = () => {};
  disconnect = () => {};
}
window.IntersectionObserver = IntersectionObserverMock;

const mockData = [
  { priority: 'High', count: 10, color: '#FF6384', darkColor: '#B03060' },
  { priority: 'Medium', count: 7, color: '#FFCE56', darkColor: '#B89B32' },
  { priority: 'Low', count: 3, color: '#36A2EB', darkColor: '#1C75BC' },
];

describe('DonutChart', () => {
  test('renders chart and center label', async () => {
    await act(async () => {
      render(<DonutChart finalChartData={mockData} />);
    });

    const chart = document.querySelector('svg');
    expect(chart).toBeInTheDocument();
    expect(screen.getByText(/Tickets/i)).toBeInTheDocument();
  });
});
