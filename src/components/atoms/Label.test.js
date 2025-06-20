// src/components/atoms/Label.test.js

// src/components/atoms/Label.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
// We import this to extend Jest's `expect` with DOM-specific assertions
import '@testing-library/jest-dom';
import Label from './Label'; // The component we are testing

describe('Label Component', () => {

  // Test 1: Does it render the content?
  it('should render the children text content', () => {
    // Arrange: Render the Label with simple text.
    render(<Label>Enter your name</Label>);

    // Act & Assert: Find the element by the text it displays.
    // If screen.getByText finds the element, the test implicitly passes.
    // toBeInTheDocument() makes the assertion explicit and clear.
    expect(screen.getByText('Enter your name')).toBeInTheDocument();
  });

  // Test 2: Does it correctly link to an input? (Accessibility)
  it('should have the correct "for" attribute from the htmlFor prop', () => {
    // Arrange: Render the Label with a specific htmlFor prop.
    const inputId = 'user-email';
    render(<Label htmlFor={inputId}>Email Address</Label>);

    // Act: Find the label by its text.
    const labelElement = screen.getByText('Email Address');

    // Assert: Use the `toHaveAttribute` matcher to verify the `for` attribute.
    // Note: React's `htmlFor` prop becomes the `for` attribute in HTML.
    expect(labelElement).toHaveAttribute('for', inputId);
  });
  
  // Test 3: Does it handle its CSS classes correctly?
  it('should apply both default and custom class names', () => {
  // Arrange: Render the Label with a custom className.
  const customClass = 'mt-2';
  // FIX: The closing tag is now correctly </Label>
  render(<Label className={customClass}>Password</Label>);
  
  // Act: Find the label.
  const labelElement = screen.getByText('Password');

  // Assert: Use the `toHaveClass` matcher. It can check for multiple classes at once.
  expect(labelElement).toHaveClass('form-label', 'fw-bold', customClass);
});

  // Test 4: A simple test for the default case (no custom class).
  it('should only have default classes when no custom className is provided', () => {
    // Arrange
    render(<Label>Confirm Password</Label>);
    
    // Act
    const labelElement = screen.getByText('Confirm Password');

    // Assert
    expect(labelElement).toHaveClass('form-label', 'fw-bold');
    // We can also check its full className attribute for an exact match.
    expect(labelElement.className).toBe('form-label fw-bold '); // Note the trailing space from the template literal
  });
});