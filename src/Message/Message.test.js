import { render, screen } from '@testing-library/react';
import Message from './Message'; // Adjust the import path as needed

describe('Message Component', () => {
  
  it('should render the component correctly', () => {
    render(<Message />);
    
    expect(screen.getByText('Password Reset!')).toBeInTheDocument();
    
    expect(screen.getByText('Your password has been reset sucessfully.')).toBeInTheDocument();
    
    expect(screen.getByText('Click below to login magically')).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
  });

});
