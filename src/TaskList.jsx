import React from 'react';
import TaskCard from './components/TaskCard';
import Loader from './components/Loader'; // 1. Import the new component

const TaskList = ({ tasks, isLoading, error, onChecklistToggle, onRemarkAdded, currentUser }) => {
  // 2. Use the Loader component here
  if (isLoading) return <Loader />; 
  
  if (error) return <p className="error-message">Error: {error}</p>;
  if (!tasks || tasks.length === 0) return <p>No tasks found.</p>;

  return (
    <div className="task-list-grid">
      {tasks.map(task => (
        <TaskCard 
          key={task._id} 
          task={task} 
          onChecklistToggle={onChecklistToggle} 
          onRemarkAdded={onRemarkAdded}
          currentUser={currentUser}
          onTimerStateChange={onTimerStateChange} // Pass it down
        />
      ))}
    </div>
  );
};

export default TaskList;