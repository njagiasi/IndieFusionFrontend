import { fireEvent, render, screen } from '@testing-library/react';
import Navbar from './Navbar';
import { BrowserRouter as Router } from 'react-router-dom'; // Wrap with Router to handle NavLink
import '@testing-library/jest-dom';

beforeEach(() => {
  Object.defineProperty(global, 'localStorage', {
    value: {
      getItem: jest.fn().mockReturnValue('Test User'),
      clear: jest.fn(),
    },
    writable: true,
  });
});

describe('Navbar Component', () => {

  it('renders navbar with all links', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Check if Navbar elements are rendered correctly
    expect(screen.getByText('Indie Fusion')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Create Post')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Groups')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('My Collaborations')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('logout clears localStorage and navigates to login', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Trigger logout
    const logoutLink = screen.getByText('Logout');
    fireEvent.click(logoutLink);

    // Check if localStorage is cleared
    expect(localStorage.clear).toHaveBeenCalled();
  });

  it('UserName displays correctly in navbar', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Check if the UserName from localStorage is displayed in the navbar
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('renders correct number of links in navbar', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Check for total number of links in the navbar
    const links = screen.getAllByRole('link');
    expect(links.length).toEqual(11);
});

  it('logout functionality redirects to login page', () => {
    const { history } = render(
      <Router>
        <Navbar />
      </Router>
    );

    const logoutLink = screen.getByText('Logout');
    fireEvent.click(logoutLink);

    // Check that the browser navigates to the login page
    expect(window.location.pathname).toBe('/login');
  });
});
