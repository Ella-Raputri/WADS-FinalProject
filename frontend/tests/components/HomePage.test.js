import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import HomePage from '../../src/pages/participant/HomePage';
import axios from 'axios';

// Mock all components that HomePage imports
jest.mock('../../src/components/ScheduleList', () => ({
  SecheduleList: ({ competition }) => (
    <div data-testid={`schedule-${competition.id}`}>{competition.name}</div>
  ),
}));

jest.mock('../../src/components/UpcomingCompetitionsList', () => ({
  UpcomingCompetitionsList: () => <div data-testid="upcoming-competitions">UpcomingCompetitionsList</div>,
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }) => <div data-testid="font-awesome-icon">{icon.iconName}</div>,
}));

jest.mock('../../src/components/UserData', () => () => (
  <div data-testid="user-data">UserData Component</div>
));

jest.mock('../../src/components/EditAccount', () => ({ isOpen }) => (
  isOpen ? <div data-testid="edit-account">EditAccount Component</div> : null
));

// Mock utility functions
jest.mock('@/lib/utils', () => ({
  convertToTimeZone: jest.fn().mockImplementation(date => date),
}));

// Mock AppContext
jest.mock('@/context/AppContext', () => {
  const React = require('react');
  return {
    AppContent: React.createContext({
      backendUrl: 'http://localhost:3000/',
      userData: {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        participant: {
          MandarinName: '李四',
          DOB: '1990-01-01',
          Gender: 'Male',
          Address: '123 Main St',
          Institution: 'University',
          StudentCardPhoto: 'photo.jpg'
        }
      },
      socket: null,
      initializeSocket: jest.fn(),
    }),
  };
});

jest.mock('axios');

const mockCompetitions = [
  { id: 1, name: 'Competition 1', date: '2025-06-01' },
  { id: 2, name: 'Competition 2', date: '2025-06-10' },
];

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: { success: true, result: mockCompetitions } });
  });

  it('renders user information correctly', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Welcome Back, John Doe!')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByTestId('user-data')).toBeInTheDocument();
    });
  });

  it('renders schedule list when competitions are available', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('schedule-1')).toBeInTheDocument();
      expect(screen.getByTestId('schedule-2')).toBeInTheDocument();
    });
  });

  it('shows no competitions message when array is empty', async () => {
    axios.get.mockResolvedValueOnce({ data: { success: true, result: [] } });
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('-- No Upcoming Competitions --')).toBeInTheDocument();
    });
  });

  it('opens edit account modal when change button is clicked', async () => {
    render(<HomePage />);
    
    const changeButton = screen.getByText('Change');
    fireEvent.click(changeButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('edit-account')).toBeInTheDocument();
    });
  });
});