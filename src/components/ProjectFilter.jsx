import React, { useState, useEffect, useRef } from 'react';
import { LuChevronDown } from 'react-icons/lu'; // Using a nice chevron icon

const ProjectFilter = ({ projects, selectedProject, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedProjectName =
    projects.find(p => p._id === selectedProject)?.name || 'All Projects';

  // This effect handles closing the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSelect = (projectId) => {
    onChange(projectId);
    setIsOpen(false);
  };

  return (
    <div className="project-filter-wrapper" ref={dropdownRef}>
      <button className="project-filter-button" onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedProjectName}</span>
        <LuChevronDown className={`chevron-icon ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <ul className="project-filter-menu">
          <li className="project-filter-item" onClick={() => handleSelect('all')}>
            All Projects
          </li>
          {projects.map((project) => (
            <li
              key={project._id}
              className="project-filter-item"
              onClick={() => handleSelect(project._id)}
            >
              {project.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectFilter;