import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatModal from '../../src/components/ChatModal';
import { AppContent } from '@/context/AppContext';
import axios from 'axios';
import '@testing-library/jest-dom';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock axios
jest.mock('axios');

// Mock ChatBox
jest.mock('../../src/components/ChatBox', () => ({ msg }) => <div data-testid="chatbox">{msg.Message}</div>);

const mockBackendUrl = 'http://localhost:3000/';
const mockUser = { id: '123', name: 'Test User' };

jest.mock('@/context/AppContext', () => {
  const React = require('react');
  return {
    AppContent: React.createContext(),
  };
});

const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AppContent.Provider value={providerProps}>{ui}</AppContent.Provider>,
    renderOptions
  );
};

describe('ChatModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal and header correctly', () => {
    renderWithContext(
      <ChatModal
        isOpen={true}
        onClose={jest.fn()}
        user={mockUser}
      />,
      { providerProps: { backendUrl: mockBackendUrl } }
    );

    expect(screen.getByText('Chat')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your message')).toBeInTheDocument();
  });

  it('displays user and bot messages when fetched', async () => {
    const mockMessages = [
      { Message: 'Hello', Role: 'user' },
      { Message: 'Hi, how can I help?', Role: 'AI' }
    ];

    axios.get.mockResolvedValueOnce({ data: { chat: mockMessages } });

    renderWithContext(
      <ChatModal
        isOpen={true}
        onClose={jest.fn()}
        user={mockUser}
      />,
      { providerProps: { backendUrl: mockBackendUrl } }
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('chatbox').length).toBe(2);
    });
  });

  it('sends a message and displays bot response', async () => {
    // Mock the sequence of axios calls
    axios.post.mockResolvedValueOnce({ data: { success: true } }); // sendChatbotMessage user message
    axios.get.mockResolvedValueOnce({ data: { chat: [{ Message: 'Test message', Role: 'user' }] } }); // fetch after send
    axios.post.mockResolvedValueOnce({ data: { message: 'Bot reply' } }); // generateBotResponse
    axios.post.mockResolvedValueOnce({ data: { success: true } }); // sendChatbotMessage AI message
    axios.get.mockResolvedValueOnce({ data: { chat: [{ Message: 'Test message', Role: 'user' }, { Message: 'Bot reply', Role: 'AI' }] } }); // fetch updated chat

    renderWithContext(
      <ChatModal
        isOpen={true}
        onClose={jest.fn()}
        user={mockUser}
      />,
      { providerProps: { backendUrl: mockBackendUrl } }
    );

    const input = screen.getByPlaceholderText('Type your message');
    fireEvent.change(input, { target: { value: 'Test message' } });

    const button = screen.getByTestId('button-send');
    fireEvent.click(button);

    // Wait for bot reply to appear
    await screen.findByText('Bot reply');
  });

  it('handles guest message flow correctly', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'Guest bot reply' } });

    renderWithContext(
      <ChatModal
        isOpen={true}
        onClose={jest.fn()}
        user={null}
      />,
      { providerProps: { backendUrl: mockBackendUrl } }
    );

    fireEvent.change(screen.getByPlaceholderText('Type your message'), {
      target: { value: 'Hello as guest' }
    });

    fireEvent.click(screen.getByTestId('button-send'));

    await waitFor(() => {
      expect(screen.getByText('Hello as guest')).toBeInTheDocument();
      expect(screen.getByText('Guest bot reply')).toBeInTheDocument();
    });
  });

  it('calls onClose when ✖ is clicked', () => {
    const mockClose = jest.fn();

    renderWithContext(
      <ChatModal
        isOpen={true}
        onClose={mockClose}
        user={mockUser}
      />,
      { providerProps: { backendUrl: mockBackendUrl } }
    );

    fireEvent.click(screen.getByText('✖'));
    expect(mockClose).toHaveBeenCalled();
  });
});
