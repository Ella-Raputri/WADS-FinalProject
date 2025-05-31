import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CompetitionInfo } from '../../src/components/CompetitionInfo';
import '@testing-library/jest-dom'

// Mock the CompetitionPopUp component
jest.mock('../../src/components/CompetitionPopUp', () => ({
    CompetitionPopUp: ({ isOpen, onClose }) => {
        return isOpen ? <div data-testid="popup">Popup Open</div> : null;
    },
}));

const mockCompetition = {
    Name: "Junior Singing",
    Description: [
        "This is a singing competition",
        "for junior level participants.",
        "Showcase your vocal talent!"
    ],
    CompetitionDate: {
        StartDate: "2025-07-01T00:00:00Z",
        FinalDate: "2025-07-10T00:00:00Z"
    }
};

describe("CompetitionInfo Component", () => {
    test("renders competition info correctly", () => {
        render(<CompetitionInfo competition={mockCompetition} isFirst={true} />);

        expect(screen.getByText("Junior Singing")).toBeInTheDocument();
        expect(screen.getByText(/This is a singing competition/)).toBeInTheDocument();
        expect(screen.getByText(/Date: July 1 - July 10/)).toBeInTheDocument();
    });

    test("shows popup when Register button is clicked", () => {
        render(<CompetitionInfo competition={mockCompetition} isFirst={false} />);
        
        const registerButton = screen.getByText("Register");
        fireEvent.click(registerButton);

        expect(screen.getByTestId("popup")).toBeInTheDocument();
    });
});
