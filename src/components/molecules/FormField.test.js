// src/components/molecules/FormField.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import FormField from './FormField'; // The component we're testing

describe('FormField Component', () => {
  // Define default props to avoid repetition in each test
  const defaultProps = {
    id: 'username',
    label: 'Username',
    onChange: jest.fn(),
  };

  // Clear mock call history before each test to ensure isolation
  beforeEach(() => {
    defaultProps.onChange.mockClear();
  });

  // Test 1: The crucial accessibility test
  it('should render a label and an input that are correctly associated', () => {
    render(<FormField {...defaultProps} />);

    // `getByLabelText` is the best query for this. It finds the input element
    // associated with the label that has the given text.
    // If this query succeeds, the `htmlFor` and `id` are linked correctly.
    const inputElement = screen.getByLabelText('Username');
    
    // Explicitly assert the input is in the document and has the correct ID.
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('id', defaultProps.id);
  });

  // Test 2: Verifying user interaction
  it('should call the onChange handler when the user types in the input', async () => {
    render(<FormField {...defaultProps} />);
    
    const inputElement = screen.getByLabelText('Username');
    const textToType = 'test-user';

    // Simulate a user typing into the input field
    await userEvent.type(inputElement, textToType);

    // Assert that our mock onChange function was called for each character typed
    expect(defaultProps.onChange).toHaveBeenCalledTimes(textToType.length);
  });

  // Test 3: Verifying that various props are passed down correctly
  it('should forward props like value, placeholder, and type to the underlying Input', () => {
    const customProps = {
      ...defaultProps,
      value: 'initial-value',
      placeholder: 'Enter your username...',
      type: 'email',
    };

    render(<FormField {...customProps} />);

    const inputElement = screen.getByLabelText('Username');

    // Check that the props were passed through correctly
    expect(inputElement).toHaveValue(customProps.value);
    expect(inputElement).toHaveAttribute('placeholder', customProps.placeholder);
    expect(inputElement).toHaveAttribute('type', customProps.type);
  });
  
  // Test 4: A simple check to ensure the label text is rendered
  it('should display the correct label text', () => {
    render(<FormField {...defaultProps} />);

    // `getByText` can find the label element directly by its content.
    expect(screen.getByText('Username')).toBeInTheDocument();
  });
});