// ✅ Polyfill TextEncoder and TextDecoder at the top
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// ✅ Extend Jest with DOM matchers
require('@testing-library/jest-dom');

(async () => {
  const React = require('react');
  const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
  const { MemoryRouter, Route, Routes } = require('react-router-dom');
  const axios = require('axios');
  const { toast } = require('react-toastify');
  const { Suspense } = React;

  // ✅ Lazy-load Navbar AFTER polyfill
  const Navbar = React.lazy(() => import('../../src/components/Navbar'));

  // ✅ Mocks
  jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: { success: true } }))
}));
  
  jest.mock('react-toastify', () => ({
    toast: {
      error: jest.fn(),
      success: jest.fn(),
    },
  }));

  jest.mock('@/context/AppContext', () => {
    const React = require('react');
    return {
      AppContent: React.createContext({
        backendUrl: 'http://localhost:3000/',
        userData: null,
        setUserData: jest.fn(),
        setIsLoggedIn: jest.fn(),
        cleanupSocket: jest.fn(),
      }),
    };
  });

  describe('Navbar', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const renderNavbar = (route = '/') => {
      window.history.pushState({}, 'Test page', route);
      return render(
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route
              path="*"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Navbar />
                </Suspense>
              }
            />
          </Routes>
        </MemoryRouter>
      );
    };

    it('shows login button for guest user', async () => {
      renderNavbar();
      await waitFor(() => {
        expect(screen.getByText('Login')).toBeInTheDocument();
      });
    });

    it('shows logout button for admin', async () => {
      const { AppContent } = require('@/context/AppContext');
      AppContent._currentValue.userData = { role: 'admin' };

      renderNavbar();
      await waitFor(() => {
        expect(screen.getByText('Logout')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });

    it('shows participant links for participant role', async () => {
      const { AppContent } = require('@/context/AppContext');
      AppContent._currentValue.userData = { role: 'participant' };

      renderNavbar();
      await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Competition')).toBeInTheDocument();
        expect(screen.getByText('Help')).toBeInTheDocument();
      });
    });

it('calls logout API and updates context on logout', async () => {
  const { AppContent } = require('@/context/AppContext');
  const setUserData = jest.fn();
  const setIsLoggedIn = jest.fn();
  const cleanupSocket = jest.fn();

  AppContent._currentValue = {
    backendUrl: 'http://localhost:3000/',
    userData: { role: 'participant' },
    setUserData,
    setIsLoggedIn,
    cleanupSocket,
  };

  // Override the default mock implementation for this test
  axios.post.mockImplementationOnce(() => 
    Promise.resolve({ 
      data: { success: true, message: 'Logged out' } 
    })
  );

  renderNavbar();

  // Wait for the button to appear, then click
  const logoutBtn = await screen.findByText('Logout');
  fireEvent.click(logoutBtn);

  // Wait for logout effects
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api/auth/logout');
    expect(setUserData).toHaveBeenCalledWith(null);
    expect(setIsLoggedIn).toHaveBeenCalledWith(false);
    expect(cleanupSocket).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Logged out');
  });
});

    it('shows back button on login page', async () => {
      renderNavbar('/login');
      await waitFor(() => {
        expect(screen.getByRole('link')).toHaveAttribute('href', '/');
      });
    });
  });
})();