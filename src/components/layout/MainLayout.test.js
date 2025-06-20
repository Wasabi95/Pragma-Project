// src/components/layout/MainLayout.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainLayout from './MainLayout';

describe('MainLayout Component', () => {

  // Test 1: Does the static part of the layout render?
  it('should render the main heading', () => {
    // Arrange: Render the layout. We don't even need children for this test.
    render(<MainLayout />);
    
    // Act & Assert: Find the heading by its accessible role and name.
    // This is a robust way to ensure the main title is on the page.
    const headingElement = screen.getByRole('heading', { name: /planning poker/i, level: 1 });
    expect(headingElement).toBeInTheDocument();
  });

  // Test 2: Does it correctly render its children? This is its primary contract.
  it('should render its children content', () => {
    // Arrange: Create a simple child element to pass into the layout.
    const childText = 'This is the page content';
    render(
      <MainLayout>
        <div>{childText}</div>
      </MainLayout>
    );

    // Act & Assert: Find the child element by its text.
    // If the child is found, it proves the layout is correctly rendering {children}.
    expect(screen.getByText(childText)).toBeInTheDocument();
  });
  
});