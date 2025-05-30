import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditAccount } from '../../src/components/EditAccount';
import { AppContent } from '@/context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

// Mock AppContext
jest.mock('@/context/AppContext', () => {
  const React = require('react');
  return {
    AppContent: React.createContext({
      backendUrl: 'http://localhost:3000/',
      getUserData: jest.fn(),
      uploadImage: jest.fn().mockResolvedValue('http://localhost/image.jpg'),
    }),
  };
});

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('EditAccount Component', () => {
  const defaultProps = {
    isOpen: true,
    setIsOpen: jest.fn(),
    userName: 'John Doe',
    mandarinName: '约翰',
    dateOfBirth: '01-01-2000',
    gender: 'Male',
    address: '123 Street',
    phoneNumber: '123456789',
    institution: 'Test University',
    studentCardUrl: 'http://localhost/old.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with prefilled values', () => {
    render(<EditAccount {...defaultProps} />);
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('约翰')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2000-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123 Street')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123456789')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test University')).toBeInTheDocument();
  });

  it('updates input fields', () => {
    render(<EditAccount {...defaultProps} />);
    const nameInput = screen.getByDisplayValue('John Doe');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    expect(nameInput.value).toBe('Jane Doe');
  });

  it('submits form and shows success toast', async () => {
    axios.put.mockResolvedValue({ data: { success: true } });
    render(<EditAccount {...defaultProps} />);
    fireEvent.click(screen.getByText(/Save Changes/i));
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Changes applied!');
      expect(defaultProps.setIsOpen).toHaveBeenCalledWith(false);
    });
  });

  it('uploads image when imageName is set', async () => {
    const mockUpload = jest.fn().mockResolvedValue('http://localhost/new.jpg');
    const mockGetUserData = jest.fn();

    jest.spyOn(React, 'useContext').mockReturnValue({
      backendUrl: 'http://localhost:3000/',
      getUserData: mockGetUserData,
      uploadImage: mockUpload,
    });

    render(<EditAccount {...defaultProps} />);

    // Simulate image selection (you must update UploadImage to have input with testid="img-upload")
    const fakeInput = document.createElement('input');
    fakeInput.type = 'file';
    fakeInput.setAttribute('data-testid', 'img-upload');
    document.body.appendChild(fakeInput);

    const file = new File(['hello'], 'photo.png', { type: 'image/png' });
    fireEvent.change(fakeInput, { target: { files: [file] } });

    fireEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalled();
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:3000/api/user/editUserDetails',
        expect.objectContaining({
          participantDetails: expect.objectContaining({
            studentPhotoUrl: 'http://localhost/new.jpg',
          }),
        })
      );
    });
  });

  it('shows error toast on failed submission', async () => {
    axios.put.mockRejectedValue({ response: { data: { message: 'Edit failed' } } });
    render(<EditAccount {...defaultProps} />);
    fireEvent.click(screen.getByText(/Save Changes/i));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Edit failed');
    });
  });

  it('closes modal on X icon click', () => {
    render(<EditAccount {...defaultProps} />);
    const closeIcon = screen.getByTestId('modal-close-icon');
    fireEvent.click(closeIcon);
    expect(defaultProps.setIsOpen).toHaveBeenCalledWith(false);
  });

  it('changes gender selection', () => {
    render(<EditAccount {...defaultProps} />);
    const genderSelect = screen.getByDisplayValue('Male');
    fireEvent.change(genderSelect, { target: { value: 'Female' } });
    expect(genderSelect.value).toBe('Female');
  });

  it('calls showPicker when calendar icon is clicked', () => {
    render(<EditAccount {...defaultProps} />);
    const input = screen.getByDisplayValue('2000-01-01');
    input.showPicker = jest.fn();
    Object.defineProperty(input, 'showPicker', {
      value: input.showPicker,
    });

    const calendarButton = screen.getAllByRole('button').find(btn => btn.classList.contains('calendardate'));
    fireEvent.click(calendarButton);
    expect(input.showPicker).toHaveBeenCalled();
  });

  it('disables button when loading', () => {
    render(<EditAccount {...defaultProps} />);
    const button = screen.getByText(/Save Changes/i);
    fireEvent.click(button);
    expect(button).toHaveClass('cursor-not-allowed');
  });
});