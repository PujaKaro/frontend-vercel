import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomTimePicker from '../CustomTimePicker';

describe('CustomTimePicker', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    label: 'Select Time',
    placeholder: 'Choose your preferred time',
    minTime: '04:00',
    maxTime: '22:00',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with default props', () => {
    render(<CustomTimePicker {...defaultProps} />);
    
    expect(screen.getByText('Select Time')).toBeInTheDocument();
    expect(screen.getByText('Choose your preferred time')).toBeInTheDocument();
  });

  test('opens dropdown when clicked', () => {
    render(<CustomTimePicker {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByText('Quick Select')).toBeInTheDocument();
    expect(screen.getByText('Custom Time')).toBeInTheDocument();
  });

  test('displays selected time correctly', () => {
    render(<CustomTimePicker {...defaultProps} value="09:30" />);
    
    expect(screen.getByText('9:30 AM')).toBeInTheDocument();
  });

  test('calls onChange when time is selected', () => {
    const onChange = jest.fn();
    render(<CustomTimePicker {...defaultProps} onChange={onChange} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Click on a time option
    const timeOption = screen.getByText('6:00 AM');
    fireEvent.click(timeOption);
    
    // Click confirm
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    expect(onChange).toHaveBeenCalledWith('06:00');
  });

  test('validates time within business hours', () => {
    const onChange = jest.fn();
    render(
      <CustomTimePicker 
        {...defaultProps} 
        onChange={onChange}
        minTime="09:00"
        maxTime="17:00"
      />
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Try to select a time outside business hours
    const timeOption = screen.getByText('6:00 AM');
    fireEvent.click(timeOption);
    
    // Click confirm
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    // Should show error message
    expect(screen.getByText('Please select a time between 09:00 and 17:00')).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('handles custom time input', () => {
    const onChange = jest.fn();
    render(<CustomTimePicker {...defaultProps} onChange={onChange} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Change hour to 2
    const hourSelect = screen.getByDisplayValue('9');
    fireEvent.change(hourSelect, { target: { value: '2' } });
    
    // Change period to PM
    const periodSelect = screen.getByDisplayValue('AM');
    fireEvent.change(periodSelect, { target: { value: 'PM' } });
    
    // Click confirm
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    expect(onChange).toHaveBeenCalledWith('14:00');
  });
});
