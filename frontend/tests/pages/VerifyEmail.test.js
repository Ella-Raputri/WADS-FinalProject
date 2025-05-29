import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VerifyEmailPage from '../../src/pages/VerifyEmail'; // Adjust the path as needed
import { AppContent } from '@/context/AppContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock('@/context/AppContext', () => {
  const React = require('react');
  return {
    AppContent: React.createContext(),
  };
});

const renderWithContext = (emailState = 'test@example.com') => {
  const mockContext = {
    backendUrl: 'http://localhost:5000/',
    getUserData: jest.fn(),
    initializeSocket: jest.fn(),
  };

  render(
    <AppContent.Provider value={mockContext}>
      <MemoryRouter initialEntries={[{ pathname: '/verify', state: { email: emailState } }]}>
        <Routes>
          <Route path="/verify" element={<VerifyEmailPage />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </AppContent.Provider>
  );
};

describe('VerifyEmailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page and OTP inputs', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true, message: 'OTP sent' } });

    renderWithContext();

    expect(await screen.findByText(/verify email/i)).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(6);
  });

  it('redirects to login if email is missing in state', () => {
    renderWithContext(null);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('fills OTP inputs correctly', async () => {
    axios.post.mockResolvedValue({ data: { success: true, message: 'OTP sent' } });
    renderWithContext();

    const inputs = await screen.findAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '1' } });
    fireEvent.change(inputs[1], { target: { value: '2' } });
    fireEvent.change(inputs[2], { target: { value: '3' } });
    fireEvent.change(inputs[3], { target: { value: '4' } });
    fireEvent.change(inputs[4], { target: { value: '5' } });
    fireEvent.change(inputs[5], { target: { value: '6' } });

    inputs.forEach((input, i) => {
      expect(input).toHaveValue((i + 1).toString());
    });
  });

  it('handles OTP submission success', async () => {
    axios.post
      .mockResolvedValueOnce({ data: { success: true, message: 'OTP sent' } }) // for sending OTP
      .mockResolvedValueOnce({
        data: { success: true, message: 'Verified', userData: { _id: '123' } },
      }); // for verify-account

    renderWithContext();

    const inputs = await screen.findAllByRole('textbox');
    inputs.forEach((input, i) =>
      fireEvent.change(input, { target: { value: (i + 1).toString() } })
    );

    fireEvent.click(screen.getByRole('button', { name: /submit otp/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/userhome');
    });
  });

  it('handles wrong OTP submission', async () => {
    axios.post
      .mockResolvedValueOnce({ data: { success: true, message: 'OTP sent' } }) // sending OTP
      .mockResolvedValueOnce({
        data: { success: false, message: 'Wrong OTP' },
      }); // verify-account

    renderWithContext();

    const inputs = await screen.findAllByRole('textbox');
    inputs.forEach((input, i) =>
      fireEvent.change(input, { target: { value: (i + 1).toString() } })
    );

    fireEvent.click(screen.getByRole('button', { name: /submit otp/i }));

    await waitFor(() => {
      expect(require('react-toastify').toast.error).toHaveBeenCalledWith('Wrong OTP');
    });
  });

});
