import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterAgent from '../../src/components/FilterAgent'; // Adjust the import path as needed

// Setup a div with id="root" for Modal.setAppElement
beforeAll(() => {
  const root = document.createElement('div');
  root.setAttribute('id', 'root');
  document.body.appendChild(root);
});

describe('FilterAgent Modal', () => {
  const mockOnClose = jest.fn();
  const mockOnApply = jest.fn();
  const defaultFilters = {
    status: 'online',
    sort: 'ascending',
  };

  const renderModal = (isOpen = true) => {
    return render(
      <FilterAgent
        isOpen={isOpen}
        onClose={mockOnClose}
        onApply={mockOnApply}
        currFilters={defaultFilters}
      />
    );
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnApply.mockClear();
  });

  test('renders modal with initial filters', () => {
    renderModal();

    expect(screen.getByText('Filter')).toBeInTheDocument();
    expect(screen.getByText('✖')).toBeInTheDocument();

    const statusSelect = screen.getByDisplayValue('Online');
    const sortSelect = screen.getByDisplayValue('Ascending');
    
    expect(statusSelect).toHaveValue('online');
    expect(sortSelect).toHaveValue('ascending');
  });

  test('calls onClose when ✖ button is clicked', () => {
    renderModal();
    fireEvent.click(screen.getByText('✖'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('updates filter values when dropdowns are changed', () => {
    renderModal();

    fireEvent.change(screen.getByDisplayValue('Online'), {
      target: { value: 'offline' },
    });
    fireEvent.change(screen.getByDisplayValue('Ascending'), {
      target: { value: 'descending' },
    });
    expect(screen.getByDisplayValue('Offline')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Descending')).toBeInTheDocument();
  });

  test('calls onApply with current filters and closes modal when Apply is clicked', () => {
    renderModal();
    fireEvent.change(screen.getByDisplayValue('Online'), {
      target: { value: 'offline' },
    });
    fireEvent.change(screen.getByDisplayValue('Ascending'), {
      target: { value: 'descending' },
    });

    fireEvent.click(screen.getByText('Apply'));
    expect(mockOnApply).toHaveBeenCalledWith({
      status: 'offline',
      sort: 'descending',
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('resets dropdowns when Reset button is clicked', () => {
    renderModal();
    fireEvent.click(screen.getByText('Reset'));
    expect(screen.getByDisplayValue('Select Status')).toBeInTheDocument(); 
    expect(screen.getByDisplayValue('Select Sorting Method')).toBeInTheDocument();
  });

  test('does not render anything when modal is closed', () => {
    renderModal(false);
    expect(screen.queryByText('Filter')).not.toBeInTheDocument();
  });
});
