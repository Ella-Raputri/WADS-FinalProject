import React from 'react';
import { render, screen, waitFor } from '@testing-library/react'; // add this line
import '@testing-library/jest-dom'; // add this line for extended jest matchers
import HomePage from '../../src/pages/participant/HomePage';
import { AppContent } from '@/context/AppContext';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

// Mock navigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Dummy context value
const mockUserData = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  phone: '1234567890',
  participant: {
    MandarinName: '约翰',
    DOB: '2000-01-01T00:00:00.000Z',
    Gender: 'Male',
    Address: '123 Example St',
    Institution: 'Test University',
    StudentCardPhoto: 'url-to-photo.jpg',
  },
};

const mockContextValue = {
  userData: mockUserData,
  backendUrl: 'http://localhost:3000/',
  socket: null,
  initializeSocket: jest.fn(),
};

describe('HomePage', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        success: true,
        result: [],
      },
    });
  });

  it('renders user name and email', async () => {
    render(
      <AppContent.Provider value={mockContextValue}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </AppContent.Provider>
    );

    expect(await screen.findByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('redirects to /completeinfo if user has no phone', async () => {
    const incompleteUserData = { ...mockUserData, phone: null };
    render(
      <AppContent.Provider value={{ ...mockContextValue, userData: incompleteUserData }}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </AppContent.Provider>
    );

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/completeinfo');
    });
  });

  it('shows "No Upcoming Competitions" if list is empty', async () => {
    render(
      <AppContent.Provider value={mockContextValue}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </AppContent.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('-- No Upcoming Competitions --')).toBeInTheDocument();
    });
  });
});
