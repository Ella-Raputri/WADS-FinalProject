import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForgotPasswordPage from '../../src/pages/ForgotPassword';
import axios from 'axios';
import { AppContent } from '@/context/AppContext';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom'

// Mock dependencies
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock FontAwesome icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }) => <div data-testid={`icon-${icon.iconName}`} />,
}));

// Mock InputField component
jest.mock('@/components/InputField', () => (props) => (
  <input 
    data-testid={props.id}
    type={props.type}
    value={props.value}
    onChange={props.onChange}
    placeholder={props.placeholder}
  />
));

jest.mock('@/context/AppContext', () => {
  const React = require('react');
  return {
    AppContent: React.createContext(),
  };
});

describe('ForgotPasswordPage Component', () => {
  const mockContext = {
    backendUrl: 'http://localhost:5000/',
  };

  beforeEach(() => {
    axios.post.mockReset();
    toast.error.mockClear();
    toast.success.mockClear();
  });

  it('renders the initial email form', () => {
    render(
      <MemoryRouter>
        <AppContent.Provider value={mockContext}>
          <ForgotPasswordPage />
        </AppContent.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByText('Send OTP to Email')).toBeInTheDocument();
  });

  it('handles email submission and shows OTP form', async () => {
    axios.post.mockResolvedValueOnce({
      data: { success: true, message: 'OTP sent successfully' }
    });

    render(
      <MemoryRouter>
        <AppContent.Provider value={mockContext}>
          <ForgotPasswordPage />
        </AppContent.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByText('Send OTP to Email'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/send-reset-otp',
        { email: 'test@example.com' }
      );
      expect(toast.success).toHaveBeenCalledWith('OTP sent successfully');
      expect(screen.getByText('Insert the 6-number OTP sent to your email.')).toBeInTheDocument();
    });
  });

  it('handles OTP submission and shows new password form', async () => {
    axios.post
      .mockResolvedValueOnce({ // First call for sending OTP
        data: { success: true, message: 'OTP sent successfully' }
      })
      .mockResolvedValueOnce({ // Second call for verifying OTP
        data: { success: true, message: 'OTP verified' }
      });

    render(
      <MemoryRouter>
        <AppContent.Provider value={mockContext}>
          <ForgotPasswordPage />
        </AppContent.Provider>
      </MemoryRouter>
    );

    // Fill email and submit
    fireEvent.change(screen.getByTestId('email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByText('Send OTP to Email'));
    
    await waitFor(() => {
      // Fill OTP
      const otpInputs = screen.getAllByRole('textbox');
      otpInputs.forEach((input, index) => {
        fireEvent.change(input, { target: { value: (index + 1).toString() } });
      });
      
      // Submit OTP
      fireEvent.click(screen.getByText('Submit OTP'));
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('OTP verified');
      expect(screen.getByText('Set a new password with at least 8 characters with the combination of letters and numbers.')).toBeInTheDocument();
    });
  });

  it('handles password reset submission', async () => {
    axios.post
      .mockResolvedValueOnce({ // OTP send
        data: { success: true }
      })
      .mockResolvedValueOnce({ // OTP verify
        data: { success: true }
      })
      .mockResolvedValueOnce({ // Password reset
        data: { success: true, message: 'Password reset successful' }
      });

    render(
      <MemoryRouter>
        <AppContent.Provider value={mockContext}>
          <ForgotPasswordPage />
        </AppContent.Provider>
      </MemoryRouter>
    );

    // Go through all steps
    fireEvent.change(screen.getByTestId('email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByText('Send OTP to Email'));
    
    await waitFor(() => {
      const otpInputs = screen.getAllByRole('textbox');
      otpInputs.forEach((input, index) => {
        fireEvent.change(input, { target: { value: (index + 1).toString() } });
      });
      fireEvent.click(screen.getByText('Submit OTP'));
    });

    await waitFor(() => {
      fireEvent.change(screen.getByTestId('password'), {
        target: { value: 'newPassword123' }
      });
      fireEvent.click(screen.getByText('Set New Password'));
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Password reset successful');
    });
  });

  it('shows error when OTP is wrong', async () => {
    axios.post
      .mockResolvedValueOnce({ // OTP send
        data: { success: true }
      })
      .mockResolvedValueOnce({ // OTP verify (failure)
        data: { success: false, message: 'Invalid OTP' }
      });

    render(
      <MemoryRouter>
        <AppContent.Provider value={mockContext}>
          <ForgotPasswordPage />
        </AppContent.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByText('Send OTP to Email'));
    
    await waitFor(() => {
      const otpInputs = screen.getAllByRole('textbox');
      otpInputs.forEach((input, index) => {
        fireEvent.change(input, { target: { value: '1' } });
      });
      fireEvent.click(screen.getByText('Submit OTP'));
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid OTP');
    });
  });

  it('handles OTP paste functionality', async () => {
    axios.post.mockResolvedValueOnce({
      data: { success: true }
    });

    render(
      <MemoryRouter>
        <AppContent.Provider value={mockContext}>
          <ForgotPasswordPage />
        </AppContent.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByText('Send OTP to Email'));
    
    await waitFor(() => {
      const otpContainer = screen.getByTestId('icon-eye');
      fireEvent.paste(otpContainer, {
        clipboardData: {
          getData: () => '123456'
        }
      });
      
      const otpInputs = screen.getAllByRole('textbox');
      otpInputs.forEach((input, index) => {
        expect(input.value).toBe((index + 1).toString());
      });
    });
  });

  
});