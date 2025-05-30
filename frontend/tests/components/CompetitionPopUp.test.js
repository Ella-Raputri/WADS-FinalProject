import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { CompetitionPopUp } from '../../src/components/CompetitionPopUp';
import axios from 'axios';
import { toast } from 'react-toastify';


// Mock AppContext
jest.mock('@/context/AppContext', () => ({
  AppContent: {
    Provider: ({ children }) => children,
    _currentValue: {
      backendUrl: 'http://localhost:3000/',
      userData: { id: '123' },
      isLoggedIn: true,
      initializeSocket: jest.fn(),
      cleanupSocket: jest.fn(),
    }
  }
}));

// Mock axios
jest.mock('axios');

// Mock toast
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
  }
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

// Mock react-modal
jest.mock('react-modal', () => ({
  __esModule: true,
  default: ({ children, isOpen }) => (isOpen ? <div>{children}</div> : null),
}));

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }) => <span>{icon}</span>
}));
jest.mock('@fortawesome/free-solid-svg-icons', () => ({
  faTimes: 'times-icon'
}));

// Mock UploadTwibbonPayment
jest.mock('../../src/components/UploadTwibbonPayment', () => ({
  __esModule: true,
  default: ({ isOpen }) => (isOpen ? <div data-testid="upload-modal">Upload Modal</div> : null),
}));

const mockCompetition = {
  _id: 'comp1',
  Name: 'Test Competition',
  Price: '$100',
  Venue: 'Test Venue',
  CompetitionDate: {
    StartDate: '2025-06-01',
    EndDate: '2025-06-10',
    FinalDate: '2025-06-15',
  },
  MainPrize: ['First prize', 'Second prize'],
  Description: ['Requirement 1', 'Requirement 2'],
};

describe('CompetitionPopUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: { success: true, canRegister: true } });
  });

  it('renders competition details when open', async () => {
    render(
      <CompetitionPopUp 
        competition={mockCompetition}
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Test Competition')).toBeInTheDocument();
      expect(screen.getByText('Price: $100 / Person')).toBeInTheDocument();
      expect(screen.getByText('Venue: Test Venue')).toBeInTheDocument();
    });
  });

  it('shows register button when user can register', async () => {
    render(
      <CompetitionPopUp 
        competition={mockCompetition}
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Register')).toBeInTheDocument();
    });
  });

  it('shows registered button when user is already registered', async () => {
    axios.get.mockResolvedValue({ data: { success: true, canRegister: false } });
    
    render(
      <CompetitionPopUp 
        competition={mockCompetition}
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Registered')).toBeInTheDocument();
    });
  });

  it('opens upload modal when register button is clicked', async () => {
    render(
      <CompetitionPopUp 
        competition={mockCompetition}
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Register'));
      expect(screen.getByTestId('upload-modal')).toBeInTheDocument();
    });
  });

  it('redirects to login when not logged in', async () => {
    // Override context to simulate not logged in
    const { AppContent } = require('@/context/AppContext');
    AppContent._currentValue.isLoggedIn = false;

    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(
      <CompetitionPopUp 
        competition={mockCompetition}
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Register'));
      expect(toast.warning).toHaveBeenCalledWith(
        'Please log in or register an account first.'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});