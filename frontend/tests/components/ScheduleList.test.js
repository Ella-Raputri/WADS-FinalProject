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

  it('hides CompetitionPopUp when "close" is triggered', () => {
    render(<SecheduleList competition={mockCompetition} />);
 const detailsButton = screen.getAllByText('Details')[0];
    fireEvent.click(detailsButton);
 // Assuming CompetitionPopUp calls the onClose prop to close fireEvent.click(screen.getByTestId('competition-popup'));
    expect(screen.queryByTestId('competition-popup')).not.toBeInTheDocument();
  });

  it('opens StatusModal when "Status" button is clicked', () => {
    render(<SecheduleList competition={mockCompetition} />);
    
    const statusButton = screen.getAllByText('Status')[0];
    fireEvent.click(statusButton);
    expect(screen.getByTestId('status-modal')).toBeInTheDocument();
  });

  it('hides StatusModal when "close" is triggered', () => {
    render(<SecheduleList competition={mockCompetition} />);
    
    const statusButton = screen.getAllByText('Status')[0];
    fireEvent.click(statusButton);
    
    // Assuming StatusModal calls the onClose prop to close
    fireEvent.click(screen.getByTestId('status-modal'));
    expect(screen.queryByTestId('status-modal')).not.toBeInTheDocument();
  });

  it('correctly handles edge case when competition dates are invalid', () => {
    const invalidCompetition = {
      CompetitionDate: {
        StartDate: 'invalid-date',
        EndDate: 'invalid-date',
      },
      Name: 'Invalid Date Competition'
    };

    render(<SecheduleList competition={invalidCompetition} />);

    expect(screen.queryByText('Invalid Date Competition')).toBeInTheDocument();
    expect(screen.queryByText('Submission Due:')).toBeInTheDocument();
  });

  it('correctly handles edge case when no competition data is provided', () => {
    render(<SecheduleList competition={null} />);

    expect(screen.queryByText('Submission Due:')).not.toBeInTheDocument();
    expect(screen.queryByText('Details')).not.toBeInTheDocument();
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
  });
});