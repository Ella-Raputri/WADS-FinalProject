import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../../src/components/Navbar';
import { AppContent } from '@/context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/' }),
}));

// Mock Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  Bars3Icon: ({ className }) => <div className={className} data-testid="bars-icon">Bars</div>,
  XMarkIcon: ({ className }) => <div className={className} data-testid="x-mark-icon">X</div>,
  ChevronLeftIcon: ({ className }) => <div className={className} data-testid="chevron-left-icon">Chevron</div>,
}));

// Mock context
jest.mock('@/context/AppContext', () => {
  const React = require('react');
  return {
    AppContent: React.createContext(),
  };
});

// Create a custom render function with different locations
const renderWithLocation = (component, pathname = '/') => {
  const mockUseLocation = jest.fn(() => ({ pathname }));
  jest.doMock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: mockUseLocation,
  }));
  
  return render(component);
};

describe('Navbar', () => {
  const mockContextValue = {
    backendUrl: 'http://localhost/',
    userData: null,
    setUserData: jest.fn(),
    setIsLoggedIn: jest.fn(),
    cleanupSocket: jest.fn(),
  };

  const participantContextValue = {
    ...mockContextValue,
    userData: { role: 'participant', name: 'Test User' },
  };

  const adminContextValue = {
    ...mockContextValue,
    userData: { role: 'admin', name: 'Admin User' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    axios.post.mockResolvedValue({
      data: { success: true, message: 'Logged out successfully' },
    });
  });

  describe('Guest user (not logged in)', () => {
    it('renders navbar with guest navigation and login button', () => {
      render(
        <AppContent.Provider value={mockContextValue}>
          <Router>
            <Navbar />
          </Router>
        </AppContent.Provider>
      );

      // Check logo and brand
      expect(screen.getByAltText('Logo')).toBeInTheDocument();
      expect(screen.getByText('NMC')).toBeInTheDocument();

      // Check guest navigation items
      expect(screen.getByText('Welcome')).toBeInTheDocument();
      expect(screen.getByText('Competition')).toBeInTheDocument();
      expect(screen.getByText('Help')).toBeInTheDocument();

      // Check login button
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    });

    it('applies correct styling for guest user', () => {
      render(
        <AppContent.Provider value={mockContextValue}>
          <Router>
            <Navbar />
          </Router>
        </AppContent.Provider>
      );

      const navbar = screen.getByRole('navigation');
      expect(navbar).toHaveClass('bg-white');
      expect(navbar).not.toHaveClass('red-navbar');
    });
  });

  describe('Participant user', () => {
    it('renders navbar with participant navigation and logout button', () => {
      render(
        <AppContent.Provider value={participantContextValue}>
          <Router>
            <Navbar />
          </Router>
        </AppContent.Provider>
      );

      // Check participant navigation items
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Competition')).toBeInTheDocument();
      expect(screen.getByText('Help')).toBeInTheDocument();

      // Check logout button
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    it('handles logout for participant', async () => {
      render(
        <AppContent.Provider value={participantContextValue}>
          <Router>
            <Navbar />
          </Router>
        </AppContent.Provider>
      );

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('http://localhost/api/auth/logout');
      });

      expect(participantContextValue.setIsLoggedIn).toHaveBeenCalledWith(false);
      expect(participantContextValue.setUserData).toHaveBeenCalledWith(null);
      expect(participantContextValue.cleanupSocket).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Logged out successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Admin user', () => {
    it('renders navbar with admin navigation and logout button', () => {
      render(
        <AppContent.Provider value={adminContextValue}>
          <Router>
            <Navbar />
          </Router>
        </AppContent.Provider>
      );

      // Check admin navigation items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Competition')).toBeInTheDocument();
      expect(screen.getByText('Ticket')).toBeInTheDocument();

      // Check logout button
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    it('applies correct styling for admin user', () => {
      render(
        <AppContent.Provider value={adminContextValue}>
          <Router>
            <Navbar />
          </Router>
        </AppContent.Provider>
      );

      const navbar = screen.getByRole('navigation');
      expect(navbar).toHaveClass('red-navbar');
      expect(navbar).not.toHaveClass('bg-white');
    });

    it('handles logout for admin', async () => {
      render(
        <AppContent.Provider value={adminContextValue}>
          <Router>
            <Navbar />
          </Router>
        </AppContent.Provider>
      );

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('http://localhost/api/auth/logout');
      });

      expect(adminContextValue.setIsLoggedIn).toHaveBeenCalledWith(false);
      expect(adminContextValue.setUserData).toHaveBeenCalledWith(null);
      expect(adminContextValue.cleanupSocket).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Logged out successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Mobile menu functionality', () => {
    it('toggles mobile menu when hamburger button is clicked', () => {
      render(
        <AppContent.Provider value={mockContextValue}>
          <Router>
            <Navbar />
          </Router>
        </AppContent.Provider>
      );

      // Initially shows hamburger icon
      expect(screen.getByTestId('bars-icon')).toBeInTheDocument();

      // Click to open menu
      const menuButton = screen.getByRole('button', { name: /open main menu/i });
      fireEvent.click(menuButton);

      // Should show X icon when menu is open
      expect(screen.getByTestId('x-mark-icon')).toBeInTheDocument();
    });
  });

  describe('Navigation links', () => {
    it('renders correct href attributes for guest navigation', () => {
      render(
        <AppContent.Provider value={mockContextValue}>
          <Router>
            <Navbar />
          </Router>
        </AppContent.Provider>
      );

      expect(screen.getByRole('link', { name: 'Welcome' })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: 'Competition' })).toHaveAttribute('href', '/usercomp');
      expect(screen.getByRole('link', { name: 'Help' })).toHaveAttribute('href', '/userhelp');
    });

    it('renders correct href attributes for participant navigation', () => {
      render(
        <AppContent.Provider value={participantContextValue}>
          <Router>
            <Navbar />
          </Router>
        </AppContent.Provider>
      );

      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/userhome');
      expect(screen.getByRole('link', { name: 'Competition' })).toHaveAttribute('href', '/usercomp');
      expect(screen.getByRole('link', { name: 'Help' })).toHaveAttribute('href', '/userhelp');
    });

    it('renders correct href attributes for admin navigation', () => {
      render(
        <AppContent.Provider value={adminContextValue}>
          <Router>
            <Navbar />
          </Router>
        </AppContent.Provider>
      );

      expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/admindashboard');
      expect(screen.getByRole('link', { name: 'Competition' })).toHaveAttribute('href', '/admincomp');
      expect(screen.getByRole('link', { name: 'Ticket' })).toHaveAttribute('href', '/adminticket');
    });
  });
});