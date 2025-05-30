// __tests__/TicketManagement.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TicketManagement from '@/pages/admin/TicketManagement'; // Adjust path as needed
import { AppContent } from '@/context/AppContext';
import axios from 'axios';
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';

// Mock AppContext
jest.mock('@/context/AppContext', () => {
  const React = require('react');
  return {
    AppContent: React.createContext(),
  };
});

// Helper to render with context
const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AppContent.Provider value={providerProps}>{ui}</AppContent.Provider>,
    renderOptions
  );
};

// Mock axios
jest.mock('axios');

const mockTickets = [
  {
    _id: '1',
    Subject: 'Test ticket 1',
    CreatedAt: '2023-01-01T00:00:00Z',
    UpdatedAt: '2023-01-02T00:00:00Z',
    PriorityType: 'High',
    Status: 'Open',
  },
  {
    _id: '2',
    Subject: 'Second ticket',
    CreatedAt: '2023-01-03T00:00:00Z',
    UpdatedAt: '2023-01-04T00:00:00Z',
    PriorityType: 'Low',
    Status: 'Closed',
  },
];

// Helper to mock context values
const mockContextValue = {
  backendUrl: 'http://localhost/',
  userData: { id: 'user1', admin: { CompTypeId: 'comp123' } },
  socket: null,
  initializeSocket: jest.fn(),
};

describe('TicketManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock GET updatedAt endpoint for each ticket
    axios.get.mockImplementation(url => {
      if (url.startsWith(`${mockContextValue.backendUrl}api/ticket/getTicketByCompId`)) {
        return Promise.resolve({ data: { success: true, tickets: mockTickets } });
      }
      if (url.startsWith(`${mockContextValue.backendUrl}api/ticket/getUpdatedAtByTicketId`)) {
        const ticketId = new URL(url).searchParams.get('ticketId');
        const ticket = mockTickets.find(t => t._id === ticketId);
        return Promise.resolve({ data: { latestUpdatedAt: ticket ? ticket.UpdatedAt : null } });
      }
      return Promise.reject(new Error('not found'));
    });
  });


  it('calls initializeSocket when no socket and userData available', async () => {
    renderWithContext(
        <TicketManagement />,
        {providerProps: mockContextValue}
    );

    await waitFor(() => {
      expect(mockContextValue.initializeSocket).toHaveBeenCalledWith(mockContextValue.userData.id);
    });
  });

  it('filters tickets by search input', async () => {
    renderWithContext(
        <MemoryRouter><TicketManagement /></MemoryRouter>,
        {providerProps: mockContextValue}
    );

    await waitFor(() => {
        expect(screen.queryByText((content, element) => {
            return content.includes('Test ticket 1');
        })).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search subject/i);
    fireEvent.change(searchInput, { target: { value: 'second' } });

    // After searching, only 'Second ticket' should be visible
    expect(screen.queryByText(/Test ticket 1/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Second ticket/i)).toBeInTheDocument();

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });

    expect(screen.getByText(/Test ticket 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Second ticket/i)).toBeInTheDocument();
  });

  it('opens filter modal', async () => {
    renderWithContext(
        <MemoryRouter><TicketManagement /></MemoryRouter>,
        {providerProps: mockContextValue}
    );

    await waitFor(() => {
        expect(screen.queryByText((content, element) => {
            return content.includes('Test ticket 1');
        })).toBeInTheDocument();
    });


    const filterButton = screen.getByTestId('filter');
    fireEvent.click(filterButton);

    // The FilterModal should be visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();

  });

  it('displays no data message if no tickets', async () => {
    axios.get.mockResolvedValueOnce({ data: { success: true, tickets: [] } });
    
    renderWithContext(
        <TicketManagement />,
        {providerProps: mockContextValue}
    );

    await waitFor(() => {
      expect(screen.getByText(/No data available/i)).toBeInTheDocument();
    });
  });

  // Add more tests for pagination and sorting if needed
});
