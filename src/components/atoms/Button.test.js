// src/components/atoms/Button.test.js

import React from 'react';
// render: Renders the component into a virtual DOM.
// screen: A utility to find elements on the "screen".
// fireEvent: A utility to simulate user events like clicks.
import { render, screen, fireEvent } from '@testing-library/react';
// We import this to extend Jest's `expect` with DOM-specific assertions like `toBeDisabled`.
import '@testing-library/jest-dom'; 
import Button from './Button'; // The component we're testing

describe('Button Component', () => {

  // Test 1: The most basic test. Does it even render?
  it('should render the button with its children', () => {
    // Arrange: Render the Button component with some text.
    render(<Button>Click Me</Button>);

    // Act & Assert: Use `screen.getByText` to find an element with the text "Click Me".
    // If it's found, the test passes. If not, it fails.
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  // Test 2: The most important behavior. Does it respond to clicks?
  it('should call the onClick handler when clicked', () => {
    // Arrange 1: Create a mock function using jest.fn(). This function will "spy" on the onClick prop.
    const mockOnClick = jest.fn();
    
    // Arrange 2: Render the button, passing our mock function as the onClick prop.
    render(<Button onClick={mockOnClick}>Click Me</Button>);

    // Act: Find the button by its role and simulate a user click.
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(buttonElement);

    // Assert: Check if our mock function was called exactly one time.
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  // Test 3: The critical edge case. Does `disabled` work correctly?
  it('should NOT call the onClick handler when disabled', () => {
    // Arrange: Create another mock function.
    const mockOnClick = jest.fn();
    
    // Arrange: Render the button with the `disabled` prop set to true.
    render(<Button onClick={mockOnClick} disabled={true}>Click Me</Button>);

    // Act: Find the button and click it.
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(buttonElement);

    // Assert: Crucially, we expect the mock function to NOT have been called.
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  // Test 4: Verifying attributes. Does it correctly receive props?
  it('should be disabled when the disabled prop is true', () => {
    // Arrange: Render the disabled button.
    render(<Button disabled={true}>Disabled</Button>);
    
    // Assert: Use the `toBeDisabled` matcher to check the element's state.
    expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled();
  });

  // Test 5: A "nice-to-have" test for styling and other attributes.
  it('should apply the correct className and type', () => {
    // Arrange: Render the button with specific props for className and type.
    render(<Button className="btn-danger" type="submit">Submit</Button>);

    // Act: Find the button element.
    const buttonElement = screen.getByRole('button', { name: /submit/i });

    // Assert: Check that the element has the base class and the custom class.
    expect(buttonElement).toHaveClass('btn', 'btn-danger');
    // Assert: Check that the element has the correct type attribute.
    expect(buttonElement).toHaveAttribute('type', 'submit');
  });

});