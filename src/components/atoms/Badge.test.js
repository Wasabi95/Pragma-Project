////src/components/atoms/Badge.test.js
import { render, screen } from '@testing-library/react';
import Badge from './Badge';

describe('Badge Component', () => {
  test('renders children content', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  test('applies correct type class', () => {
    const { rerender } = render(<Badge type="primary">Primary</Badge>);
    expect(screen.getByText('Primary')).toHaveClass('bg-primary');

    rerender(<Badge type="danger">Danger</Badge>);
    expect(screen.getByText('Danger')).toHaveClass('bg-danger');
  });

  test('uses primary as default type', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default')).toHaveClass('bg-primary');
  });

  test('applies fs-6 class', () => {
    render(<Badge>Test</Badge>);
    expect(screen.getByText('Test')).toHaveClass('fs-6');
  });

  test('matches snapshot', () => {
    const { asFragment } = render(<Badge type="success">Success</Badge>);
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders with empty children', () => {
    const { container } = render(<Badge></Badge>);
    const badge = container.querySelector('.badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toBeEmptyDOMElement();
  });

  test('handles numeric children', () => {
    render(<Badge>{42}</Badge>);
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});