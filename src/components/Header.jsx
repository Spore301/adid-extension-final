import React from 'react';
import ProjectFilter from './ProjectFilter';
import StatusPills from './StatusPills';

const Header = ({
  user,
  onLogout,
  projects,
  selectedProject,
  onProjectChange,
  statusCounts,
  selectedStatus,
  onStatusChange,
}) => {
  return (
    <div className="header">
      <div className="top-bar">
        <div className="branding">
          <img src="/icons/logo.svg" alt="ADID Logo" className="logo" />
          <span className="company-name">ADID Taskmanager</span>
        </div>
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="filters-container">
        <ProjectFilter
          projects={projects}
          selectedProject={selectedProject}
          onChange={onProjectChange}
        />
        <StatusPills
          statusCounts={statusCounts}
          selectedStatus={selectedStatus}
          onSelect={onStatusChange}
        />
      </div>
    </div>
  );
};

export default Header;