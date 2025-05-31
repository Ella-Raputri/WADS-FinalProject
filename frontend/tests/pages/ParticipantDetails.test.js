import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ParticipantDetails from '@/pages/admin/ParticipantDetails';
import { AppContent } from '@/context/AppContext';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock AppContext
jest.mock('@/context/AppContext', () => {
  const React = require('react');
  return {
    AppContent: React.createContext(),
  };
});

// Mock other dependencies
jest.mock('@/components/Loading', () => () => <div data-testid="loading">Loading...</div>);
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

const sampleData = {
  _id: '123',
  Status: 'Pending',
  PaymentProof: 'payment.jpg',
  TwibbonProof: 'twibbon.jpg',
  userDetails: {
    FullName: 'Alice Example',
    Email: 'alice@example.com',
    PhoneNumber: '123456789',
    Participant: {
      MandarinName: '爱丽丝',
      DOB: '2000-01-01T00:00:00.000Z',
      Gender: 'Female',
      Address: '123 Street',
      Institution: 'ABC University',
      StudentCardPhoto: 'studentcard.jpg',
    },
  },
};

const providerProps = {
  userData: {
    id: 'admin1',
    admin: { CompTypeId: 'comp123' },
  },
  socket: null,
  backendUrl: 'http://localhost:5000/',
  initializeSocket: jest.fn(),
};

// Helper to render with context and router
const renderWithProviders = (ui, { routeState } = {}) => {
  window.history.pushState({}, 'Test page', '/participant');
  return render(
    <AppContent.Provider value={providerProps}>
      <MemoryRouter initialEntries={[{ pathname: '/participant', state: { data: routeState } }]}>
        {ui}
      </MemoryRouter>
    </AppContent.Provider>
  );
};

describe('ParticipantDetails Component', () => {
  it('shows loading when no data is passed', () => {
    renderWithProviders(<ParticipantDetails />, { routeState: null });
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders participant details when data is provided', async () => {
    renderWithProviders(<ParticipantDetails />, { routeState: sampleData });

    expect(await screen.findByText('Participant Details')).toBeInTheDocument();
    expect(screen.getByText(/Alice Example/)).toBeInTheDocument();
    expect(screen.getByText(/爱丽丝/)).toBeInTheDocument();
    expect(screen.getByText(/Female/)).toBeInTheDocument();
    expect(screen.getByAltText('Student Card')).toBeInTheDocument();
    expect(screen.getByAltText('Payment Proof')).toBeInTheDocument();
    expect(screen.getByAltText('Twibbon Proof')).toBeInTheDocument();
  });

  it('shows admin comment box and buttons if status is Pending', async () => {
    renderWithProviders(<ParticipantDetails />, { routeState: sampleData });

    expect(await screen.findByText('Admin Comments')).toBeInTheDocument();
    expect(screen.getByText('Accept')).toBeInTheDocument();
    expect(screen.getByText('Reject')).toBeInTheDocument();
  });

  it('calls axios and updates status when Accept button is clicked', async () => {
    axios.put.mockResolvedValueOnce({ data: { success: true, message: 'Updated successfully' } });

    renderWithProviders(<ParticipantDetails />, { routeState: sampleData });

    const textarea = await screen.findByPlaceholderText(/Type your message here/i);
    fireEvent.change(textarea, { target: { value: 'Looks good' } });

    const acceptBtn = screen.getByText('Accept');
    fireEvent.click(acceptBtn);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/competitionRegistration/123'),
        expect.objectContaining({ status: 'Accepted', adminComment: 'Looks good' })
      );
    });
  });

  it('calls axios and updates status when Reject button is clicked', async () => {
    axios.put.mockResolvedValueOnce({ data: { success: true, message: 'Updated successfully' } });

    renderWithProviders(<ParticipantDetails />, { routeState: sampleData });

    const textarea = await screen.findByPlaceholderText(/Type your message here/i);
    fireEvent.change(textarea, { target: { value: 'Incomplete document' } });

    const rejectBtn = screen.getByText('Reject');
    fireEvent.click(rejectBtn);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/competitionRegistration/123'),
        expect.objectContaining({ status: 'Rejected', adminComment: 'Incomplete document' })
      );
    });
  });
});
