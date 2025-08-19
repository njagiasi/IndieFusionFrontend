import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmationModal from './ConfirmationModal'; // Adjust the import path as needed

describe('ConfirmationModal Component', () => {
  it('should render the modal with correct title and children when show is true', () => {
    render(
      <ConfirmationModal show={true} handleClose={() => {}} title="Confirm Action" handleSubmit={() => {}} >
        <p>Are you sure you want to proceed?</p>
      </ConfirmationModal>
    );
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
  });
  it('should not render the modal when show is false', () => {
    render(
      <ConfirmationModal show={false} handleClose={() => {}} title="Confirm Action" handleSubmit={() => {}} >
        <p>Are you sure you want to proceed?</p>
      </ConfirmationModal>
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('should call handleClose when the close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <ConfirmationModal show={true} handleClose={handleClose} title="Confirm Action" handleSubmit={() => {}} >
        <p>Are you sure you want to proceed?</p>
      </ConfirmationModal>
    );

    // Click on the Close button
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    // Ensure handleClose is called once
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call handleSubmit when the submit button is clicked', () => {
    const handleSubmit = jest.fn();
    render(
      <ConfirmationModal show={true} handleClose={() => {}} title="Confirm Action" handleSubmit={handleSubmit} >
        <p>Are you sure you want to proceed?</p>
      </ConfirmationModal>
    );

    // Click on the Submit button
    fireEvent.click(screen.getByRole('button', { name: /ok/i }));

    // Ensure handleSubmit is called once
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('should disable the submit button when submitDisable is true', () => {
    render(
      <ConfirmationModal 
        show={true} 
        handleClose={() => {}} 
        title="Confirm Action" 
        handleSubmit={() => {}} 
        submitDisable={true}
      >
        <p>Are you sure you want to proceed?</p>
      </ConfirmationModal>
    );

    // Check if the Submit button is disabled
    expect(screen.getByRole('button', { name: /ok/i })).toBeDisabled();
  });

  it('should enable the submit button when submitDisable is false', () => {
    render(
      <ConfirmationModal 
        show={true} 
        handleClose={() => {}} 
        title="Confirm Action" 
        handleSubmit={() => {}} 
        submitDisable={false}
      >
        <p>Are you sure you want to proceed?</p>
      </ConfirmationModal>
    );

    // Check if the Submit button is enabled
    expect(screen.getByRole('button', { name: /ok/i })).not.toBeDisabled();
  });
});
