import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HelpPage from '../../src/pages/participant/HelpPage';
import { AppContent } from '@/context/AppContext';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom'

// Mocks
jest.mock('axios');
jest.mock('@/components/Table', () => (props) => (
  <div data-testid="table">Mocked Table</div>
));
jest.mock('@/components/AccordionFAQ', () => () => <div>FAQ Content</div>);
jest.mock('@/components/Pagination', () => (props) => (
  <div data-testid="pagination">Mocked Pagination</div>
));
jest.mock('@/components/FilterModal', () => (props) => (
  props.isOpen ? <div data-testid="filter-modal">Mocked Filter Modal</div> : null
));
jest.mock('@/components/ChatModal', () => (props) => (
  props.isOpen ? <div data-testid="chat-modal">Mocked Chat Modal</div> : null
));

jest.mock('@/context/AppContext', () => {
  const React = require('react');
  return {
    AppContent: React.createContext(),
  };
});

// Context mock
const mockContextValue = {
  backendUrl: 'http://localhost/',
  isLoggedIn: true,
  userData: { id: '123', name: 'Test User' },
  socket: null,
  initializeSocket: jest.fn(),
};

describe('HelpPage', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        success: true,
        tickets: [
          {
            _id: 'ticket1',
            CreatedAt: '2024-01-01T00:00:00Z',
            PriorityType: 'high',
            Status: 'open',
          },
        ],
      },
    });

    // Mock updatedAt response
    axios.get.mockImplementation((url) => {
      if (url.includes('getUpdatedAtByTicketId')) {
        return Promise.resolve({ data: { latestUpdatedAt: '2024-01-02T00:00:00Z' } });
      }
      return Promise.resolve({ data: { success: true, tickets: [] } });
    });
  });

  it('renders FAQ section and buttons', async () => {
    render(
      <AppContent.Provider value={mockContextValue}>
        <Router>
          <HelpPage />
        </Router>
      </AppContent.Provider>
    );

    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new ticket/i })).toBeInTheDocument();

    // Wait for async fetch
    await waitFor(() => expect(screen.getByTestId('table')).toBeInTheDocument());
  });

  it('opens filter modal on button click', async () => {
    render(
      <AppContent.Provider value={mockContextValue}>
        <Router>
          <HelpPage />
        </Router>
      </AppContent.Provider>
    );

    const filterButton = screen.getAllByRole('button')[1]; // Filter icon
    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(screen.getByTestId('filter-modal')).toBeInTheDocument();
    });
  });

  it('opens ChatModal when chat icon is clicked', async () => {
    render(
      <AppContent.Provider value={mockContextValue}>
        <Router>
          <HelpPage />
        </Router>
      </AppContent.Provider>
    );

    const chatButton = screen.getByTestId('btnai'); // Chat icon has no name
    fireEvent.click(chatButton);

    await waitFor(() => {
      expect(screen.getByTestId('chat-modal')).toBeInTheDocument();
    });
  });
});
