// src/index.test.js
// src/index.test.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.js';
import { store } from './store/store.js';

// Mock the 'react-dom/client' module
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(),
}));

// Mock the App component and the store
jest.mock('./App', () => () => <div id="mock-app"></div>);
jest.mock('./store/store', () => ({
  store: { getState: jest.fn(), subscribe: jest.fn(), dispatch: jest.fn() },
}));

describe('Application Root', () => {
  it('should render the application into the root element', () => {
    // 1. Arrange
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    const mockRender = jest.fn();
    // Configure the mock createRoot to return an object with our mock render function
    createRoot.mockImplementation(() => ({
      render: mockRender,
    }));

    // 2. Act
    // Running the index.js file will execute the ReactDOM.createRoot and root.render calls
    require('./index.js');

    // 3. Assert
    // Check if createRoot was called with the correct element
    expect(createRoot).toHaveBeenCalledWith(rootElement);

    // Check if render was called once
    expect(mockRender).toHaveBeenCalledTimes(1);

    // Get the component that was passed to the render function
    const renderedComponent = mockRender.mock.calls[0][0];

    // Verify the structure of the rendered component tree
    expect(renderedComponent.type).toBe(React.StrictMode);
    const provider = renderedComponent.props.children;
    expect(provider.type).toBe(Provider);
    expect(provider.props.store).toBe(store); // Check if the correct store is passed
    expect(provider.props.children.type).toBe(App); // Check if App is the child
  });
});