import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WelcomePage from '../../src/pages/WelcomePage';
import { AppContent } from '@/context/AppContext';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    img: ({ children, ...props }) => <img {...props}>{children}</img>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
  },
}));

// Mock components
jest.mock('@/components/Carousel', () => () => (
  <div data-testid="carousel">Mocked Carousel</div>
));

jest.mock('@/components/Tassle', () => () => (
  <div data-testid="tassle">Mocked Tassle</div>
));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock context
jest.mock('@/context/AppContext', () => {
  const React = require('react');
  return {
    AppContent: React.createContext(),
  };
});

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock window.location
delete window.location;
window.location = { href: '' };

describe('WelcomePage', () => {
  const mockContextValue = {
    isLoggedIn: false,
    userData: null,
  };

  const loggedInContextValue = {
    isLoggedIn: true,
    userData: { role: 'participant' },
  };

  const adminContextValue = {
    isLoggedIn: true,
    userData: { role: 'admin' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock scrollY
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });
  });

  it('renders all main sections correctly', () => {
    render(
      <AppContent.Provider value={mockContextValue}>
        <Router>
          <WelcomePage />
        </Router>
      </AppContent.Provider>
    );

    // Check main heading
    expect(screen.getByText('NMC')).toBeInTheDocument();
    expect(screen.getByText('RELEASE YOUR POTENTIAL AND CLAIM YOUR GLORY!')).toBeInTheDocument();
    
    // Check about section
    expect(screen.getByText('ABOUT US')).toBeInTheDocument();
    expect(screen.getByText(/NMC \(National Mandarin Competition\)/)).toBeInTheDocument();
    
    // Check competitions section
    expect(screen.getByText('COMPETITIONS')).toBeInTheDocument();
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    
    // Check contact section
    expect(screen.getByText('Contact us if you have any questions!')).toBeInTheDocument();
    expect(screen.getByTestId('tassle')).toBeInTheDocument();
  });

  it('renders Join and Compete button', () => {
    render(
      <AppContent.Provider value={mockContextValue}>
        <Router>
          <WelcomePage />
        </Router>
      </AppContent.Provider>
    );

    const joinButton = screen.getByRole('button', { name: /join and compete/i });
    expect(joinButton).toBeInTheDocument();
  });

  it('navigates to /usercomp when Join and Compete button is clicked', () => {
    render(
      <AppContent.Provider value={mockContextValue}>
        <Router>
          <WelcomePage />
        </Router>
      </AppContent.Provider>
    );

    const joinButton = screen.getByRole('button', { name: /join and compete/i });
    fireEvent.click(joinButton);

    expect(mockNavigate).toHaveBeenCalledWith('/usercomp');
  });

  it('redirects participant to /userhome when logged in', () => {
    render(
      <AppContent.Provider value={loggedInContextValue}>
        <Router>
          <WelcomePage />
        </Router>
      </AppContent.Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/userhome');
  });

  it('redirects admin to /admindashboard when logged in', () => {
    render(
      <AppContent.Provider value={adminContextValue}>
        <Router>
          <WelcomePage />
        </Router>
      </AppContent.Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/admindashboard');
  });

  it('renders Contact Us and See FAQ buttons', () => {
    render(
      <AppContent.Provider value={mockContextValue}>
        <Router>
          <WelcomePage />
        </Router>
      </AppContent.Provider>
    );

    const contactButton = screen.getByRole('button', { name: /contact us/i });
    const faqButton = screen.getByRole('button', { name: /see faq/i });

    expect(contactButton).toBeInTheDocument();
    expect(faqButton).toBeInTheDocument();
  });


  it('navigates to /userhelp when See FAQ button is clicked', () => {
    render(
      <AppContent.Provider value={mockContextValue}>
        <Router>
          <WelcomePage />
        </Router>
      </AppContent.Provider>
    );

    const faqButton = screen.getByRole('button', { name: /see faq/i });
    fireEvent.click(faqButton);

    expect(mockNavigate).toHaveBeenCalledWith('/userhelp');
  });

  it('sets up IntersectionObserver for competition section', () => {
    render(
      <AppContent.Provider value={mockContextValue}>
        <Router>
          <WelcomePage />
        </Router>
      </AppContent.Provider>
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.4 }
    );
  });

  it('renders all background images with correct alt text', () => {
    render(
      <AppContent.Provider value={mockContextValue}>
        <Router>
          <WelcomePage />
        </Router>
      </AppContent.Provider>
    );

    // Check for various background images
    expect(screen.getByAltText('Light1')).toBeInTheDocument();
    expect(screen.getByAltText('Light2')).toBeInTheDocument();
    expect(screen.getByAltText('Light3')).toBeInTheDocument();
    expect(screen.getByAltText('Flower Left')).toBeInTheDocument();
    expect(screen.getByAltText('Flower Right')).toBeInTheDocument();
    expect(screen.getByAltText('Tower')).toBeInTheDocument();
    expect(screen.getByAltText('Temple')).toBeInTheDocument();
    expect(screen.getByAltText('Ferris Wheel')).toBeInTheDocument();
    expect(screen.getByAltText('Buildings')).toBeInTheDocument();
    expect(screen.getByAltText('Palace')).toBeInTheDocument();
    expect(screen.getByAltText('Ground')).toBeInTheDocument();
    expect(screen.getByAltText('Chinese Architecture')).toBeInTheDocument();
  });

  it('renders decorative images in competitions section', () => {
    render(
      <AppContent.Provider value={mockContextValue}>
        <Router>
          <WelcomePage />
        </Router>
      </AppContent.Provider>
    );

    expect(screen.getByAltText('left decor')).toBeInTheDocument();
    expect(screen.getByAltText('right decor')).toBeInTheDocument();
  });

  it('displays theme information correctly', () => {
    render(
      <AppContent.Provider value={mockContextValue}>
        <Router>
          <WelcomePage />
        </Router>
      </AppContent.Provider>
    );

    expect(screen.getByText(/Bridging Generations With Chinese Culture/)).toBeInTheDocument();
    expect(screen.getByText(/preserve Chinese culture/)).toBeInTheDocument();
  });

  it('handles scroll event listeners', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(
      <AppContent.Provider value={mockContextValue}>
        <Router>
          <WelcomePage />
        </Router>
      </AppContent.Provider>
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('does not redirect when user is not logged in', () => {
    render(
      <AppContent.Provider value={mockContextValue}>
        <Router>
          <WelcomePage />
        </Router>
      </AppContent.Provider>
    );

    // Should not call navigate when not logged in
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});