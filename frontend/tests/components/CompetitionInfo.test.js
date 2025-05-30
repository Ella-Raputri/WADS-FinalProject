
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CompetitionInfo } from '../../src/components/CompetitionInfo.jsx';
import { CompetitionPopUp } from '../../src/components/CompetitionPopUp.jsx';

jest.mock('../../src/components/CompetitionPopUp', () => ({
  CompetitionPopUp: jest.fn(() => <div data-testid="competition-popup">Mocked CompetitionPopUp</div>),
}));

describe('CompetitionInfo Component', () => {
  const competitionMock = {
    Name: "Test Competition",
    Description: ["This is a", "test description", "for competition."],
    CompetitionDate: {
      StartDate: '2023-09-15T00:00:00Z',
      FinalDate: '2023-09-20T00:00:00Z'
    }
  };  

  test('renders component with correct data', () => {
    const { getByText } = render(<CompetitionInfo competition={competitionMock} isFirst={true} />);

    expect(getByText('Test Competition')).toBeInTheDocument();
    expect(getByText('This is a test description for competition.')).toBeInTheDocument();
    expect(getByText('Date: September 15 - September 20')).toBeInTheDocument();
  });

  test('applies first component margin class correctly', () => {
    const { container } = render(<CompetitionInfo competition={competitionMock} isFirst={true} />);
    const divElement = container.querySelector('div');
    expect(divElement).toHaveClass('mt-[8em]');
  });

  test('applies non-first component margin class correctly', () => {
    const { container } = render(<CompetitionInfo competition={competitionMock} isFirst={false} />);
    const divElement = container.querySelector('div');
    expect(divElement).toHaveClass('mt-[5em]');
  });

  test('opens CompetitionPopUp on clicking Register button', () => {
    const { getByText, getByTestId } = render(<CompetitionInfo competition={competitionMock} isFirst={true} />);
    
    const registerButton = getByText('Register');
    fireEvent.click(registerButton);

    expect(getByTestId('competition-popup')).toBeInTheDocument();
  });

  test('closes CompetitionPopUp on invoking onClose', () => {
    const { getByText, queryByTestId } = render(<CompetitionInfo competition={competitionMock} isFirst={true} />);
 const registerButton = getByText('Register');
    fireEvent.click(registerButton);
    
    const onClose = CompetitionPopUp.mock.calls[0][0].onClose;
    onClose();

    expect(queryByTestId('competition-popup')).not.toBeInTheDocument();
  });

  test('handles empty competition description gracefully', () => {
    const competitionEmptyDescription = {
      ...competitionMock,
      Description: []
    };
    const { getByText } = render(<CompetitionInfo competition={competitionEmptyDescription} isFirst={true} />);
    
    expect(getByText(/Date:/)).toBeInTheDocument();
  });

  test('handles incorrect date formats gracefully', () => {
    const competitionInvalidDate = {
      ...competitionMock,
      CompetitionDate: {
        StartDate: 'invalid-date',
        FinalDate: 'invalid-date'
      }
    };
    const { getByText } = render(<CompetitionInfo competition={competitionInvalidDate} isFirst={true} />);
 expect(getByText('Date: NaN NaN - NaN NaN')).toBeInTheDocument();
  });
});