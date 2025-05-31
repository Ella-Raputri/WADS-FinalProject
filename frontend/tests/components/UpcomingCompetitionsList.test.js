import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UpcomingCompetitionsList } from '@/components/UpcomingCompetitionsList';

jest.mock('swiper/react', () => ({
  Swiper: jest.fn(({ children }) => <div>{children}</div>),
  SwiperSlide: jest.fn(({ children }) => <div>{children}</div>)
}));

jest.mock("lucide-react", () => ({
  ChevronLeft: jest.fn(({ onClick, className }) => <div data-testid="left-chevron" onClick={onClick} className={className} />),
  ChevronRight: jest.fn(({ onClick, className }) => <div data-testid="right-chevron" onClick={onClick} className={className} />),
}));

describe('UpcomingCompetitionsList', () => {
  const mockCompetitions = [
    { title: 'Competition 1', category: 'Category 1', date: '2023-09-01' },
    { title: 'Competition 2', category: 'Category 2', date: '2023-10-01' },
    { title: 'Competition 3', category: 'Category 3', date: '2023-11-01' }
  ];

  test('renders all competition slides', () => {
    const { getByText } = render(<UpcomingCompetitionsList competitions={mockCompetitions} />);
    mockCompetitions.forEach(competition => {
      expect(getByText(`Name: ${competition.title}`)).toBeInTheDocument();
      expect(getByText(`Category: ${competition.category}`)).toBeInTheDocument();
      expect(getByText(`Date: ${competition.date}`)).toBeInTheDocument();
    });
  });

  test('does not show ChevronLeft when the swiper is at the beginning', () => {
    const { queryByTestId } = render(<UpcomingCompetitionsList competitions={mockCompetitions} />);
    expect(queryByTestId('left-chevron')).toHaveClass('invisible');
  });

  test('shows ChevronRight when the swiper is not at the end', () => {
    const { queryByTestId } = render(<UpcomingCompetitionsList competitions={mockCompetitions} />);
    expect(queryByTestId('right-chevron')).not.toHaveClass('invisible');
  });

  test('handles empty competitions array gracefully', () => {
    const { container } = render(<UpcomingCompetitionsList competitions={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  
});
