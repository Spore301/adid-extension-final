import React, { useState } from 'react';
import { apiClient } from '../api';
import toast from 'react-hot-toast';

const RemarksSection = ({ taskId, remarks = [], onRemarkAdded, currentUser }) => {
  const [newRemark, setNewRemark] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newRemark.trim()) return;

    setIsSubmitting(true);
    try {
      const updatedTask = await apiClient.addRemarkToTask(taskId, { text: newRemark });
      onRemarkAdded(updatedTask);  // Update the parent state
      setNewRemark('');
    } catch (error) {
      toast.error("Failed to add comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="remarks-section">
      <h5 className="section-title">Collaboration</h5>
      <div className="remarks-list">
        {remarks.map(remark => (
          <div key={remark._id} className="remark-item">
            <img src={remark.user.profileImageUrl || '/icons/default-avatar.png'} alt={remark.user.name} className="avatar" />
            <div className="remark-content">
              <span className="remark-user">{remark.user.name}</span>
              <p className="remark-text">{remark.text}</p>
            </div>
          </div>
        ))}
      </div>
      <form className="remark-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={newRemark}
          onChange={(e) => setNewRemark(e.target.value)}
          placeholder="Add a comment..."
          className="remark-input"
          disabled={isSubmitting}
        />
        <button type="submit" className="remark-submit-btn" disabled={isSubmitting}>
          Send
        </button>
      </form>
    </div>
  );
};

export default RemarksSection;