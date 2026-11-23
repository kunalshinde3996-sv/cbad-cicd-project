import { render, screen } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios');

beforeEach(() => {
  axios.get.mockImplementation(url =>
    Promise.resolve({ data: url.endsWith('/health') ? { status: 'OK' } : { tasks: [] } })
  );
});

test('renders heading and empty state', async () => {
  render(<App />);
  expect(screen.getByText(/CBAD Task Manager/i)).toBeInTheDocument();
  expect(await screen.findByText(/No tasks yet/i)).toBeInTheDocument();
});

test('Add button is disabled for blank input', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
});
