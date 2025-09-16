import React from 'react';

const StatusPills = ({ statusCounts, selectedStatus, onSelect }) => {
  const pills = ['All', 'Pending', 'In Progress', 'Completed'];

  return (
    <div className="status-pills">
      {pills.map((pill) => (
        <button
          key={pill}
          onClick={() => onSelect(pill)}
          className={`pill ${selectedStatus === pill ? 'active' : ''}`}
        >
          {pill}
          <span className="pill-count">{statusCounts[pill] || 0}</span>
        </button>
      ))}
    </div>
  );
};

export default StatusPills;