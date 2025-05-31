import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CompleteInfoPage from '@/pages/participant/CompleteInfoPage'
import { AppContent } from '@/context/AppContext'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

// Mock toast notifications
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  }
}))

jest.mock('@/context/AppContext', () => {
  const React = require('react');
  return {
    AppContent: React.createContext(),
  };
});

// Mock FontAwesomeIcon to avoid errors during test
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span>icon</span>
}))

// Mock UploadImage component to simplify the test
// Update your UploadImage mock to properly handle files
jest.mock('@/components/UploadImage', () => ({ image, setImage, imageName, setImageName, inputId }) => (
  <input
    data-testid="upload-image"
    type="file"
    id={inputId}
    onChange={(e) => {
      const file = e.target.files[0];
      setImage(file);
      setImageName(file?.name || '');
    }}
  />
));

jest.mock('axios', () => ({
  put: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  defaults: { withCredentials: true }
}))

import axios from 'axios'
import { toast } from 'react-toastify'

const mockUploadImage = jest.fn(() => Promise.resolve('http://fakeimageurl.com/image.jpg'))
const mockGetUserData = jest.fn()
const mockCleanupSocket = jest.fn()
const mockSetIsLoggedIn = jest.fn()
const mockSetUserData = jest.fn()

const renderComponent = (userData = null) =>
  render(
    <AppContent.Provider
      value={{
        backendUrl: 'http://localhost/',
        setIsLoggedIn: mockSetIsLoggedIn,
        setUserData: mockSetUserData,
        cleanupSocket: mockCleanupSocket,
        uploadImage: mockUploadImage,
        getUserData: mockGetUserData,
        userData,
      }}
    >
      <BrowserRouter>
        <CompleteInfoPage />
      </BrowserRouter>
    </AppContent.Provider>
  )

describe('CompleteInfoPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders form fields and buttons', () => {
    renderComponent()

    expect(screen.getByPlaceholderText(/Chinese characters or -/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Your address/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Starts with \+628XX or 08XX/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Your institution/i)).toBeInTheDocument()
    expect(screen.getByTestId('dob')).toBeInTheDocument()
    expect(screen.getByTestId('gender')).toBeInTheDocument()
    expect(screen.getByLabelText(/upload student card/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('updates form data on input change', () => {
    renderComponent()

    const mandarinInput = screen.getByPlaceholderText(/Chinese characters or -/i)
    fireEvent.change(mandarinInput, { target: { value: '测试' } })
    expect(mandarinInput.value).toBe('测试')

    const addressInput = screen.getByPlaceholderText(/Your address/i)
    fireEvent.change(addressInput, { target: { value: 'Jakarta' } })
    expect(addressInput.value).toBe('Jakarta')
  })


  it('logs out successfully', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true, message: 'Logged out' } })

    renderComponent({ name: 'John Doe' })

    // Click logout button (the left chevron button)
    const logoutBtn = screen.getByTestId('logout')
    fireEvent.click(logoutBtn)

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost/api/auth/logout')
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(false)
      expect(mockSetUserData).toHaveBeenCalledWith(null)
      expect(mockCleanupSocket).toHaveBeenCalled()
      expect(toast.success).toHaveBeenCalledWith('Logged out')
    })
  })
})
