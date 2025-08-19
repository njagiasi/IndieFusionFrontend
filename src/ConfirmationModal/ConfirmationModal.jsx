const ConfirmationModal = ({ show, handleClose, title, children, handleSubmit, submitLabel = 'Ok', closeLabel = 'Cancel', submitDisable = false }) => {
  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
          </div>
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>{closeLabel}</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={submitDisable}>{submitLabel}</button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;