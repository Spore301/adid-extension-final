import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { apiClient } from './api';
import { API_PATHS, BASE_URL } from './utils/apiPaths';
import Header from './components/Header';
import TaskList from './TaskList';
import toast from 'react-hot-toast';

const TaskListView = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // --- New state to track which tasks have active timers ---
  const [activeTimerTaskIds, setActiveTimerTaskIds] = useState(new Set());

  // --- Updated data fetching logic ---
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch tasks, projects, and active timers all at once
      const [projectsData, tasksData, activeTimersData] = await Promise.all([
        apiClient.get(API_PATHS.PROJECTS.GET_ALL_PROJECTS),
        apiClient.get(API_PATHS.TASKS.GET_ALL_TASKS),
        apiClient.getActiveTimers(),
      ]);
      
      // Store the IDs of tasks with active timers
      const activeIds = new Set(activeTimersData.map(log => log.task));
      setActiveTimerTaskIds(activeIds);

      setProjects(projectsData || []);
      setTasks(tasksData.tasks || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- New handler to update active timers and re-sort ---
  const handleTimerStateChange = (taskId, isRunning) => {
    setActiveTimerTaskIds(prevIds => {
      const newIds = new Set(prevIds);
      if (isRunning) {
        newIds.add(taskId);
      } else {
        newIds.delete(taskId);
      }
      return newIds;
    });
  };

  const handleTaskUpdate = (updatedTask) => { /* ... (this function is unchanged) ... */ };
  const handleChecklistToggle = useCallback(async (taskId, todoItemId) => { /* ... (this function is unchanged) ... */ }, [tasks, user.token]);
  
  // --- Sorting logic is now applied here before filtering ---
  const sortedAndFilteredTasks = useMemo(() => {
    const sortedTasks = [...tasks].sort((a, b) => {
      const aIsActive = activeTimerTaskIds.has(a._id);
      const bIsActive = activeTimerTaskIds.has(b._id);
      if (aIsActive && !bIsActive) return -1; // a comes first
      if (!aIsActive && bIsActive) return 1;  // b comes first
      return 0; // maintain original order
    });

    return sortedTasks
      .filter(task => selectedProject === 'all' || task.project?._id === selectedProject)
      .filter(task => selectedStatus === 'All' || task.status === selectedStatus);
  }, [tasks, activeTimerTaskIds, selectedProject, selectedStatus]);

  const statusCounts = useMemo(() => { /* ... (this logic is unchanged) ... */ }, [tasks, selectedProject]);

  return (
    <div className="task-view-container">
      <Header
        user={user}
        onLogout={onLogout}
        projects={projects}
        // ... (rest of Header props are unchanged)
      />
      <TaskList 
        tasks={sortedAndFilteredTasks} 
        isLoading={isLoading} 
        error={error} 
        onChecklistToggle={handleChecklistToggle} 
        onRemarkAdded={handleTaskUpdate}
        currentUser={user}
        // --- Pass the new handler down ---
        onTimerStateChange={handleTimerStateChange}
      />
    </div>
  );
};

export default TaskListView;