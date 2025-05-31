import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CompManagement from '@/pages/admin/CompManagement';
import { AppContent } from '@/context/AppContext';
import '@testing-library/jest-dom';
import axios from 'axios';
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

// Mock dependencies
jest.mock('axios');
jest.mock('@/components/Table', () => (props) => (
  <div data-testid="mock-table">Mock Table</div>
));
jest.mock('@/components/Pagination', () => (props) => (
  <div data-testid="mock-pagination">Mock Pagination</div>
));
jest.mock('@/components/SearchBar', () => (props) => (
  <input data-testid="mock-searchbar" onChange={(e) => props.onApply(e.target.value)} />
));
jest.mock('@/components/SaveButton', () => () => <button data-testid="mock-save">Save</button>);
jest.mock('@/components/FilterStatusModal', () => (props) =>
  props.isOpen ? <div data-testid="mock-filter">Filter Modal</div> : null
);
jest.mock('@/components/Loading', () => () => <div data-testid="loading">Loading...</div>);

// Mock context values
const providerProps = {
  userData: {
    id: 'admin1',
    admin: { CompTypeId: 'comp123' },
  },
  socket: null,
  backendUrl: 'http://localhost:5000/',
  initializeSocket: jest.fn(),
};

describe('CompManagement Component', () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/competitionRegistration/')) {
        return Promise.resolve({
          data: {
            success: true,
            competitions: [
              {
                id: '1',
                CreatedAt: new Date().toISOString(),
                Status: 'Pending',
                userDetails: {
                  FullName: 'Alice',
                  Email: 'alice@example.com',
                  PhoneNumber: '123456',
                },
              },
            ],
          },
        });
      }
      if (url.includes('/getCompetitionDetails')) {
        return Promise.resolve({
          data: {
            success: true,
            comp: { Name: 'Sample Competition' },
          },
        });
      }
    });
  });

  it('shows loading spinner initially and renders data after fetch', async () => {
    renderWithContext(
        <MemoryRouter>
          <CompManagement />
        </MemoryRouter>,
        {providerProps: providerProps}
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Sample Competition Competition/i)).toBeInTheDocument();
      expect(screen.getByTestId('mock-table')).toBeInTheDocument();
    });
  });

  it('can perform a search that updates results', async () => {
    renderWithContext(
        <MemoryRouter>
          <CompManagement />
        </MemoryRouter>,
        {providerProps: providerProps}
    );

    await waitFor(() => {
      expect(screen.getByTestId('mock-table')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('mock-searchbar');
    fireEvent.change(searchInput, { target: { value: 'Alice' } });

    // Because Table is mocked, we just ensure input interaction doesn't throw
    expect(searchInput.value).toBe('Alice');
  });

  it('shows filter modal when filter button is clicked', async () => {
    renderWithContext(
        <MemoryRouter>
          <CompManagement />
        </MemoryRouter>,
        {providerProps: providerProps}
    );

    await waitFor(() => {
      expect(screen.getByTestId('mock-table')).toBeInTheDocument();
    });

    const filterButton = screen.getByTestId('filter');
    fireEvent.click(filterButton);

    expect(screen.getByTestId('mock-filter')).toBeInTheDocument();
  });
});
