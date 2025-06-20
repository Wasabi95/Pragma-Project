// src/components/atoms/RadioInput.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import RadioInput from './RadioInput'; // The component we are testing

describe('RadioInput Component', () => {

  const defaultProps = {
    id: 'test-radio-1',
    name: 'test-group',
    value: 'test-value',
    label: 'Test Option',
    onChange: jest.fn(),
  };

  // Clear the mock function's call history before each test
  beforeEach(() => {
    defaultProps.onChange.mockClear();
  });

  // Test 1: Basic rendering and accessibility check
  it('should render a radio button and a label linked together', () => {
    render(<RadioInput {...defaultProps} />);

    // Use `getByLabelText` to find the input via its associated label text.
    // This is the best way to test the htmlFor/id connection.
    // If this query succeeds, the link is working correctly.
    const radioElement = screen.getByLabelText(defaultProps.label);

    // Assert that the element is a radio button and is in the document.
    expect(radioElement).toBeInTheDocument();
    expect(radioElement).toHaveAttribute('type', 'radio');
  });

  // Test 2: Verify it works as a controlled component
  it('should reflect the checked state based on the "checked" prop', () => {
    // Arrange: Render the component with checked=true
    const { rerender } = render(<RadioInput {...defaultProps} checked={true} />);
    
    // Assert: The radio button should be checked
    expect(screen.getByLabelText(defaultProps.label)).toBeChecked();

    // Act: Re-render the same component with checked=false
    rerender(<RadioInput {...defaultProps} checked={false} />);

    // Assert: The radio button should now be unchecked
    expect(screen.getByLabelText(defaultProps.label)).not.toBeChecked();
  });

  // Test 3: The primary user interaction
  it('should call onChange when the radio input is clicked', async () => {
    render(<RadioInput {...defaultProps} checked={false} />);
    
    const radioElement = screen.getByLabelText(defaultProps.label);

    // Act: Simulate a user clicking directly on the radio button
    await userEvent.click(radioElement);

    // Assert: The onChange handler should have been called
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  // Test 4: The crucial accessibility interaction
  it('should call onChange when the associated label is clicked', async () => {
    render(<RadioInput {...defaultProps} checked={false} />);
    
    // This time, find the label element by its text content
    const labelElement = screen.getByText(defaultProps.label);

    // Act: Simulate a user clicking on the LABEL, not the input
    await userEvent.click(labelElement);

    // Assert: The onChange handler for the input should still be called
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  // Test 5: Check that other important attributes are passed down
  it('should have the correct name and value attributes', () => {
    render(<RadioInput {...defaultProps} />);
    
    const radioElement = screen.getByLabelText(defaultProps.label);

    expect(radioElement).toHaveAttribute('name', defaultProps.name);
    expect(radioElement).toHaveAttribute('value', defaultProps.value);
  });

  // Test 6: Check custom styling
  it('should apply the custom className to the wrapper div', () => {
    const customClass = 'my-custom-radio';
    render(<RadioInput {...defaultProps} className={customClass} />);

    // The class is on the parent div, so we find the input and then navigate up.
    const radioElement = screen.getByLabelText(defaultProps.label);
    const wrapperDiv = radioElement.closest('div');
    
    // Assert that the wrapper has the base classes and our custom one
    expect(wrapperDiv).toHaveClass('form-check', 'form-check-inline', customClass);
  });
});