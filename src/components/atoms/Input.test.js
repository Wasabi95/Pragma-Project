// src/components/atoms/Input.test.js
// src/components/atoms/Input.test.js

import React, { useState } from 'react'; // Import useState for the test
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Input from './Input';

describe('Input Component', () => {

  describe('when type is "text" (default)', () => {
    it('should render a standard text input element', () => {
      render(<Input placeholder="Enter username" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter username')).toHaveClass('form-control');
    });

    // --- THIS IS THE FIXED TEST ---
    it('should call onChange and update value when the user types', async () => {
      // 1. Create a simple wrapper component to manage the state
      const ControlledInputWrapper = () => {
        const [value, setValue] = useState('');
        // The mock function will be passed to the wrapper
        const mockOnChange = jest.fn((e) => setValue(e.target.value));
        
        return <Input value={value} onChange={mockOnChange} />;
      };

      // 2. Render the wrapper component
      render(<ControlledInputWrapper />);
      
      const inputElement = screen.getByRole('textbox');
      
      // 3. Simulate typing
      await userEvent.type(inputElement, 'hello');

      // 4. Assert that the input's value has been updated correctly in the DOM
      // This is a more robust check than spying on the onChange handler
      expect(inputElement).toHaveValue('hello');
    });
  });

  describe('when type is "textarea"', () => {
    it('should render a textarea element', () => {
      render(<Input type="textarea" />);
      const textareaElement = screen.getByRole('textbox');
      expect(textareaElement).toBeInTheDocument();
      expect(textareaElement.tagName).toBe('TEXTAREA');
      expect(textareaElement).toHaveAttribute('rows', '2');
    });

    // --- THIS IS THE FIXED TEST (using the same pattern) ---
    it('should call onChange and update value when the user types in the textarea', async () => {
      const TextAreaWrapper = () => {
        const [value, setValue] = useState('');
        const mockOnChange = jest.fn((e) => setValue(e.target.value));
        return <Input type="textarea" value={value} onChange={mockOnChange} />;
      };
      
      render(<TextAreaWrapper />);
      
      const textareaElement = screen.getByRole('textbox');
      await userEvent.type(textareaElement, 'description');

      expect(textareaElement).toHaveValue('description');
    });
  });

  describe('when type is "radio"', () => {
    // ... your radio tests are correct and do not need to be changed ...
    it('should render a radio input element with the correct class', () => {
      render(<Input type="radio" />);
      expect(screen.getByRole('radio')).toHaveClass('form-check-input');
    });

    it('should be checked if the "checked" prop is true', () => {
      render(
        <>
          <Input type="radio" name="option" value="a" checked={true} onChange={() => {}} />
          <Input type="radio" name="option" value="b" checked={false} onChange={() => {}} />
        </>
      );
      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons[0]).toBeChecked();
      expect(radioButtons[1]).not.toBeChecked();
    });

    it('should call onChange when the radio button is clicked', async () => {
      const mockOnChange = jest.fn();
      render(<Input type="radio" checked={false} onChange={mockOnChange} />);
      const radioElement = screen.getByRole('radio');
      await userEvent.click(radioElement);
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
  });
});