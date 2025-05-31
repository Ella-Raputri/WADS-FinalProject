import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import CompetitionPage from '../../src/pages/participant/CompetitionPage';
import axios from 'axios';
import { toast } from 'react-toastify';

// ✅ Fully mock AppContext before it's imported
jest.mock('@/context/AppContext', () => {
  const React = require('react');
  return {
    AppContent: React.createContext({
      backendUrl: 'http://localhost:3000/',
      userData: { id: '123' },
      socket: null,
      initializeSocket: jest.fn(),
    }),
  };
});

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));
jest.mock('../../src/components/CompetitionInfo', () => ({
  CompetitionInfo: ({ competition }) => (
    <div data-testid={`competition-${competition.id}`}>{competition.name}</div>
  ),
}));

const mockCompetitions = [
  { id: 1, name: 'Competition 1', date: '2025-06-01' },
  { id: 2, name: 'Competition 2', date: '2025-06-10' },
];

describe('CompetitionPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders competitions when data is available', async () => {
    axios.get.mockResolvedValue({ data: { success: true, comps: mockCompetitions } });
    render(<CompetitionPage />);
    await waitFor(() => {
      expect(screen.getByTestId('competition-1')).toBeInTheDocument();
      expect(screen.getByTestId('competition-2')).toBeInTheDocument();
    });
  });

  it('shows no competitions message when array is empty', async () => {
    axios.get.mockResolvedValue({ data: { success: true, comps: [] } });
    render(<CompetitionPage />);
    await waitFor(() => {
      expect(screen.getByText('-- No Upcoming Competitions --')).toBeInTheDocument();
    });
  });

  it('shows error message when API call fails', async () => {
    axios.get.mockRejectedValue({
      response: { data: { message: 'Failed to load' } },
    });
    render(<CompetitionPage />);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load');
    });
  });

  it('initializes socket when userData is available', async () => {
    const { AppContent } = require('@/context/AppContext');
    const mockSocketInit = jest.fn();

    // Override context value manually
    AppContent._currentValue = {
      backendUrl: 'http://localhost:3000/',
      userData: { id: '123' },
      socket: null,
      initializeSocket: mockSocketInit,
    };

    axios.get.mockResolvedValue({ data: { success: true, comps: [] } });
    render(<CompetitionPage />);
    await waitFor(() => {
      expect(mockSocketInit).toHaveBeenCalledWith('123');
    });
  });
});
