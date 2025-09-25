import React, { useState } from 'react';

// We no longer need apiClient or toast here because the parent component handles it.

const RemarksSection = ({ taskId, remarks = [], onRemarkAdded, currentUser }) => {
  const [newRemark, setNewRemark] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation(); // This prevents the card from closing when you submit
    if (!newRemark.trim()) return;

    // This now calls the powerful handler in TaskListView.jsx
    onRemarkAdded(taskId, newRemark.trim());
    
    // Clear the input for the next comment
    setNewRemark('');
  };

  return (
    <div className="remarks-section">
      <h5 className="section-title">Collaboration</h5>
      {remarks.length > 0 && (
        <div className="remarks-list">
          {remarks.map(remark => (
            <div key={remark._id} className="remark-item">
              <img 
                src={remark.madeBy?.profileImageUrl || '/icons/logo.svg'} 
                alt={remark.madeBy?.name} 
                className="avatar" 
              />
              <div className="remark-content">
                {/* Fallback to the current user's name for new comments that appear instantly */}
                <span className="remark-user">{remark.madeBy?.name || currentUser.name}</span>
                <p className="remark-text">{remark.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <form className="remark-form" onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
        <input
          type="text"
          value={newRemark}
          onChange={(e) => setNewRemark(e.target.value)}
          placeholder="Add a comment..."
          className="remark-input"
        />
        <button type="submit" className="remark-submit-btn">
          Send
        </button>
      </form>
    </div>
  );
};

export default RemarksSection;