import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SecheduleList } from '@/components/ScheduleList';

// Mock the imported components
jest.mock('@/components/CompetitionPopUp', () => ({
  CompetitionPopUp: () => <div data-testid="competition-popup">CompetitionPopUp</div>
}));

jest.mock('@/components/StatusModal', () => ({
  StatusModal: () => <div data-testid="status-modal">StatusModal</div>
}));

describe('SecheduleList', () => {
  const mockCompetition = {
    CompetitionDate: {
      StartDate: '2023-10-01T00:00:00.000Z',
      EndDate: '2023-10-15T00:00:00.000Z',
    },
    Name: 'Sample Competition'
  };

  it('renders the correct date information and competition name', () => {
    render(<SecheduleList competition={mockCompetition} />);
 expect(screen.getByText('SUN')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Oct 2023')).toBeInTheDocument();
    expect(screen.getByText('Sample Competition')).toBeInTheDocument();
    expect(screen.getByText('Submission Due: Oct 15')).toBeInTheDocument();
  });

  it('opens CompetitionPopUp when "Details" button is clicked', () => {
    render(<SecheduleList competition={mockCompetition} />);
    
    const detailsButton = screen.getAllByText('Details')[0];
    fireEvent.click(detailsButton);
    expect(screen.getByTestId('competition-popup')).toBeInTheDocument();
  });

  it('opens StatusModal when "Status" button is clicked', () => {
    render(<SecheduleList competition={mockCompetition} />);
    
    const statusButton = screen.getAllByText('Status')[0];
    fireEvent.click(statusButton);
    expect(screen.getByTestId('status-modal')).toBeInTheDocument();
  });

  
});