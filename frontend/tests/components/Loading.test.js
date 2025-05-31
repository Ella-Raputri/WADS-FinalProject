// Loading.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loading from '../../src/components/Loading';

describe('Loading component', () => {
  test('renders bouncing dots', () => {
    render(<Loading />);
    const bouncingDots = screen.getAllByTestId('bouncing-dot');
    expect(bouncingDots).toHaveLength(3);
  });


  test('renders "Loading..." text', () => {
    render(<Loading />);
    const loadingText = screen.getByText(/Loading/i);
    expect(loadingText).toBeInTheDocument();
    expect(loadingText.textContent).toMatch(/^Loading\.\.\.$/);
  });
});
