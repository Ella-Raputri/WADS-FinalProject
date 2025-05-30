import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewTicket from '../../src/pages/participant/NewTicket';
import { AppContent } from '@/context/AppContext';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('axios');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@/context/AppContext', () => {
  const React = require('react');
  return {
    AppContent: React.createContext(),
  };
});

const mockUploadImage = jest.fn();

const mockContext = {
  backendUrl: 'http://localhost:5000/',
  userData: { id: 'user1' },
  socket: null,
  initializeSocket: jest.fn(),
  uploadImage: mockUploadImage,
};

describe('NewTicket component', () => {
  beforeEach(() => {
    axios.get.mockClear();
    axios.post.mockClear();
    mockNavigate.mockClear();
    mockUploadImage.mockClear();
  });

  const renderComponent = () => render(
    <AppContent.Provider value={mockContext}>
      <MemoryRouter>
        <NewTicket />
      </MemoryRouter>
    </AppContent.Provider>
  );

  test('renders form inputs and button', () => {
    renderComponent();

    expect(screen.getByText(/New Help Ticket/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter subject/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type your message/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Ticket/i)).toBeInTheDocument();
  });

  test('submits form with required data', async () => {
    axios.get.mockResolvedValue({ data: { id: 'comp123' } });
    axios.post.mockResolvedValue({ data: { success: true } });
    mockUploadImage.mockResolvedValue('http://image.url');

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/Enter subject/i), {
      target: { value: 'Test Subject' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Type your message/i), {
      target: { value: 'This is a test message.' },
    });

    const submitButton = screen.getByText(/Create Ticket/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:5000/api/competition/getCompetitionIdByName?compName=Junior Singing'
      );
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/ticket/uploadNewTicket',
        expect.any(Object)
      );
      expect(mockNavigate).toHaveBeenCalledWith('/userhelp');
    });
  });

  test('shows error toast on API error', async () => {
    axios.get.mockRejectedValue({ response: { data: { message: 'Something went wrong' } } });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/Enter subject/i), {
      target: { value: 'Fail Subject' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Type your message/i), {
      target: { value: 'Error should happen.' },
    });

    fireEvent.click(screen.getByText(/Create Ticket/i));

    await waitFor(() => {
      expect(screen.getByText(/Create Ticket/i)).toBeInTheDocument();
    });
  });
});
