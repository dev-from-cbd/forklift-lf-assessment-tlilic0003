import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminPanel from './AdminPanel';

test('renders AdminPanel component', () => {
	render(<AdminPanel />);
	const linkElement = screen.getByText(/Admin Panel/i);
	expect(linkElement).toBeInTheDocument();
});