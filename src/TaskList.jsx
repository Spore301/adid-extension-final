import React from 'react';
import TaskCard from './components/TaskCard';

// Accept onChecklistToggle as a prop
const TaskList = ({ tasks, isLoading, error, onChecklistToggle }) => {
  if (isLoading) return <p>Loading tasks...</p>;
  // ... (error and empty states)

  return (
    <div className="task-list-grid">
      {tasks.map(task => (
        <TaskCard 
          key={task._id} 
          task={task} 
          // Pass the handler down to the card
          onChecklistToggle={onChecklistToggle} 
        />
      ))}
    </div>
  );
};

export default TaskList;