import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminTicketDetails from '../../src/pages/admin/AdminTicketDetails';
import '@testing-library/jest-dom';
import { AppContent } from '@/context/AppContext';

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

// Mock child components used in AdminTicketDetails
jest.mock('@/components/Chatbox', () => () => <div data-testid="ChatBox">ChatBox</div>);
jest.mock('@/components/UploadImage', () => (props) => (
  <div data-testid="UploadImage">UploadImage</div>
));

// Mock axios
jest.mock('axios');

describe('AdminTicketDetails', () => {
  const mockSocket = {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  };

  const providerProps = {
    backendUrl: 'http://localhost:5000/',
    socket: mockSocket,
    initializeSocket: jest.fn(),
    uploadImage: jest.fn().mockResolvedValue('http://localhost/image.jpg'),
  };

  const mockLocationState = {
    data: {
      _id: 'ticket123',
      CompTypeId: 'comp123',
      SenderId: 'user123',
      Subject: 'Test Subject',
      Status: 'Open',
      PriorityType: 'High',
      CreatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    user: {
      id: 'admin123',
      name: 'Admin User',
    },
  };

  const setup = () => {
    return renderWithContext(
      <MemoryRouter initialEntries={[{ pathname: '/adminticketdetails', state: mockLocationState }]}>
        <Routes>
          <Route path="/adminticketdetails" element={<AdminTicketDetails />} />
        </Routes>
      </MemoryRouter>,
      { providerProps }
    );
  };

  it('renders the subject and status once loaded', async () => {
    const axios = require('axios');

    axios.get.mockImplementation((url) => {
      if (url.includes('getCompetitionDetails')) {
        return Promise.resolve({ data: { success: true, comp: { Name: 'Sample Competition' } } });
      }
      if (url.includes('fetchUserDetails')) {
        return Promise.resolve({ data: { success: true, userData: { name: 'John Doe' } } });
      }
      if (url.includes('getAdminCollabMessage')) {
        return Promise.resolve({ data: { adminCollabChat: [] } });
      }
      return Promise.resolve({ data: {} });
    });

    setup();

    await waitFor(() => {
      expect(screen.getByText(/test subject/i)).toBeInTheDocument();
      expect(screen.getByText(/sample competition/i)).toBeInTheDocument();
      expect(screen.getByText(/open/i)).toBeInTheDocument();
    });
  });


    


});
