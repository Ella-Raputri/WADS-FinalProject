import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import TicketDetails from '../../src/pages/participant/TicketDetails';
import axios from 'axios';
import { AppContent } from '@/context/AppContext';
import '@testing-library/jest-dom'

window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock axios and other dependencies
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('@/context/AppContext', () => {
  const React = require('react');
  return {
    AppContent: React.createContext(),
  };
});

// Mock context values
const mockContext = {
  backendUrl: 'http://localhost:5000/',
  socket: {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  },
  initializeSocket: jest.fn(),
  uploadImage: jest.fn(),
};

// Mock FontAwesome icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }) => <div data-testid={`icon-${icon.iconName}`} />,
}));

describe('TicketDetails Component', () => {
  const mockLocationState = {
    state: {
      data: {
        _id: '123',
        Subject: 'Test Subject',
        Description: 'Test Description',
        Status: 'Open',
        PriorityType: 'Medium',
        CompTypeId: 'comp123',
        SenderId: 'user123',
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      },
      user: {
        id: 'user123',
        role: 'participant',
      },
    },
  };

  beforeEach(() => {
    useLocation.mockReturnValue(mockLocationState);
    axios.get.mockImplementation((url) => {
      if (url.includes('getCompetitionDetails')) {
        return Promise.resolve({
          data: {
            success: true,
            comp: { Name: 'Test Competition' },
          },
        });
      }
      if (url.includes('fetchUserDetails')) {
        return Promise.resolve({
          data: {
            success: true,
            userData: { name: 'Test User' },
          },
        });
      }
      if (url.includes('getParticipantAdminMessage')) {
        return Promise.resolve({
          data: {
            adminUserChat: [
              {
                _id: 'msg1',
                Message: 'Test message',
                SenderId: { Role: 'participant', FullName: 'Test User' },
                CreatedAt: new Date().toISOString(),
              },
            ],
          },
        });
      }
      if (url.includes('getRatingTicket')) {
        return Promise.resolve({
          data: {
            rating: null,
          },
        });
      }
      return Promise.reject(new Error('Not mocked'));
    });
    axios.post.mockResolvedValue({ data: { success: true } });
    axios.put.mockResolvedValue({ data: { success: true, message: 'Success' } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('renders ticket details after loading', async () => {
    render(
      <MemoryRouter>
        <AppContent.Provider value={mockContext}>
          <TicketDetails />
        </AppContent.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Subject')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test Competition')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Open')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
    });
  });

  it('disables close button when ticket is already closed', async () => {
    const closedTicketState = {
      ...mockLocationState,
      state: {
        ...mockLocationState.state,
        data: {
          ...mockLocationState.state.data,
          Status: 'Closed',
        },
      },
    };
    useLocation.mockReturnValue(closedTicketState);

    render(
      <MemoryRouter>
        <AppContent.Provider value={mockContext}>
          <TicketDetails />
        </AppContent.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const closeButton = screen.getByText('Close');
      expect(closeButton).toBeDisabled();
    });
  });
});