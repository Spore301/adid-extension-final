import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { apiClient } from './api';
import { API_PATHS, BASE_URL } from './utils/apiPaths';
import Header from './components/Header';
import ProjectFilter from './components/ProjectFilter';
import StatusPills from './components/StatusPills';
import TaskList from './TaskList';
import toast from 'react-hot-toast';

const addToOfflineQueue = async (url, method, body, token) => {
  const { requestQueue = [] } = await chrome.storage.local.get('requestQueue');
  const newRequest = {
    id: `req_${Date.now()}`,
    url: `${BASE_URL}${url}`,
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  };
  requestQueue.push(newRequest);
  await chrome.storage.local.set({ requestQueue });
  console.log('Request added to offline queue.');
};

const TaskListView = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [projectsData, tasksData] = await Promise.all([
        apiClient.get(API_PATHS.PROJECTS.GET_ALL_PROJECTS),
        apiClient.get(API_PATHS.TASKS.GET_ALL_TASKS),
      ]);
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

  const handleChecklistToggle = useCallback(async (taskId, todoItemId) => {
    const originalTasks = tasks;
    const newTasks = tasks.map(task => {
      if (task._id === taskId) {
        const newChecklist = task.todoChecklist.map(item => 
          item._id === todoItemId ? { ...item, completed: !item.completed } : item
        );
        return { ...task, todoChecklist: newChecklist };
      }
      return task;
    });
    setTasks(newTasks);

    try {
      const taskToUpdate = newTasks.find(t => t._id === taskId);
      const response = await apiClient.put(
        API_PATHS.TASKS.UPDATE_TASK_CHECKLIST(taskId),
        { todoChecklist: taskToUpdate.todoChecklist }
      );
      setTasks(currentTasks => 
        currentTasks.map(t => t._id === taskId ? response.task : t)
      );
    } catch (err) {
      console.error("API call failed, likely offline:", err);
      toast.error("You're offline. Change saved and will sync later.");
      const taskToUpdate = newTasks.find(t => t._id === taskId);
      await addToOfflineQueue(
        API_PATHS.TASKS.UPDATE_TASK_CHECKLIST(taskId),
        'PUT',
        { todoChecklist: taskToUpdate.todoChecklist },
        user.token
      );
    }
  }, [tasks, user.token]);

  // This is the function that was missing
  const handleTaskUpdate = (updatedTask) => {
    setTasks(currentTasks => 
      currentTasks.map(t => t._id === updatedTask._id ? updatedTask : t)
    );
  };
  
  const statusCounts = useMemo(() => {
    const filteredByProject = selectedProject === 'all'
      ? tasks
      : tasks.filter(task => task.project?._id === selectedProject);

    return filteredByProject.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, { All: filteredByProject.length });
  }, [tasks, selectedProject]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => selectedProject === 'all' || task.project?._id === selectedProject)
      .filter(task => selectedStatus === 'All' || task.status === selectedStatus);
  }, [tasks, selectedProject, selectedStatus]);

  return (
    <div className="task-view-container">
      <Header
        user={user}
        onLogout={onLogout}
        projects={projects}
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
        statusCounts={statusCounts}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />
      <TaskList 
        tasks={filteredTasks} 
        isLoading={isLoading} 
        error={error} 
        onChecklistToggle={handleChecklistToggle} 
        onRemarkAdded={handleTaskUpdate} // Pass the function as onRemarkAdded
        currentUser={user}
      />
    </div>
  );
};

export default TaskListView;