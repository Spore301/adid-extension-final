import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../api';
import { API_PATHS } from '../utils/apiPaths';
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa';
import { LuClipboardCheck, LuSquare } from 'react-icons/lu';
import toast from 'react-hot-toast';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

const formatDuration = (ms) => {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const TaskCard = ({ task, onChecklistToggle }) => { // Added onChecklistToggle prop
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [activeTimeLogId, setActiveTimeLogId] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerIntervalRef = useRef(null);

  const startTicking = (startTime) => {
    clearInterval(timerIntervalRef.current);
    const startTimeMs = new Date(startTime).getTime();
    timerIntervalRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startTimeMs);
    }, 1000);
  };

  useEffect(() => {
    const checkActiveTimer = async () => {
      try {
        const response = await apiClient.get(API_PATHS.TASKS.GET_ACTIVE_TIMER(task._id));
        if (response.activeTimeLog) {
          setIsTimerActive(true);
          setActiveTimeLogId(response.activeTimeLog._id);
          startTicking(response.activeTimeLog.startTime);
        }
      } catch (error) {
        console.log(`No active timer for task: ${task.title}`);
      }
    };
    checkActiveTimer();
    return () => clearInterval(timerIntervalRef.current);
  }, [task._id, task.title]);

  const handleTimerClick = async (e) => {
    e.stopPropagation();
    if (isTimerActive) {
      if (!activeTimeLogId) return toast.error("Timer log ID not found.");
      try {
        await apiClient.put(API_PATHS.TASKS.STOP_TIMER(task._id, activeTimeLogId));
        setIsTimerActive(false);
        setActiveTimeLogId(null);
        clearInterval(timerIntervalRef.current);
        setElapsedTime(0);
        toast.success("Timer stopped!");
      } catch (error) {
        toast.error(error.message || "Failed to stop timer.");
      }
    } else {
      try {
        const response = await apiClient.post(API_PATHS.TASKS.START_TIMER(task._id));
        setIsTimerActive(true);
        setActiveTimeLogId(response.timeLog._id);
        startTicking(response.timeLog.startTime);
        toast.success("Timer started!");
      } catch (error) {
        toast.error(error.message || "Failed to start timer.");
      }
    }
  };
  
  const {
    title, project, status, priority, progress = 0, dueDate,
    createdAt, todoChecklist = [], isOverdue,
  } = task;

  const completedTodoCount = todoChecklist.filter(item => item.completed).length;

  const getStatusTagColor = () => {
    if (status === 'In Progress') return 'tag in-progress-tag';
    if (status === 'Completed') return 'tag completed-tag';
    return 'tag pending-tag';
  };

  const getPriorityTagColor = () => {
    if (priority === 'High') return 'tag priority-high-tag';
    if (priority === 'Medium') return 'tag priority-medium-tag';
    return 'tag priority-low-tag';
  };

  return (
    <div className={`task-card ${isExpanded ? 'expanded' : ''}`} onClick={() => setIsExpanded(!isExpanded)}>
      <div className="tags-container">
        {isOverdue && status !== 'Completed' && <span className="tag overdue-tag">OVERDUE</span>}
        <span className={getStatusTagColor()}>{status}</span>
        <span className={getPriorityTagColor()}>{priority}</span>
      </div>

      {project?.name && <p className="project-name">{project.name}</p>}
      <h4 className="task-title">{title}</h4>

      <div className="progress-container">
        <p>Task Done: {completedTodoCount}/{todoChecklist.length}</p>
        <div className="progress-bar-background">
          <div className="progress-bar-foreground" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {isExpanded && (
        <div className="expanded-content">
          <h5 className="checklist-title">Checklist</h5>
          {todoChecklist.length > 0 ? (
            <ul className="checklist">
              {todoChecklist.map((item) => (
                <li 
                  key={item._id} 
                  className="checklist-item" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onChecklistToggle(task._id, item._id);
                  }}
                >
                  {item.completed ? <LuClipboardCheck className="check-icon completed" /> : <LuSquare className="check-icon" />}
                  <span className={item.completed ? 'completed-text' : ''}>{item.text}</span>
                </li>
              ))}
            </ul>
          ) : <p className="no-checklist">No checklist items.</p>}
        </div>
      )}
      <div className="expanded-content">
          <h5 className="checklist-title">Checklist</h5>
          {/* ... (checklist ul is unchanged) ... */}
          
          {/* --- Add these new sections --- */}
          <TimeLogList taskId={task._id} />
          <RemarksSection 
            taskId={task._id} 
            remarks={task.remarks} 
            onRemarkAdded={onRemarkAdded} 
            currentUser={currentUser}
          />
        </div>

      <div className="card-footer">
        <div className="date-container">
          <div><label>Start Date</label><p>{formatDate(createdAt)}</p></div>
          <div><label>Due Date</label><p>{formatDate(dueDate)}</p></div>
        </div>
        
        <div className="timer-controls" onClick={handleTimerClick}>
          {isTimerActive && (
            <span className="timer-display">{formatDuration(elapsedTime)}</span>
          )}
          {isTimerActive ? (
            <FaPauseCircle className="timer-icon stop" />
          ) : (
            <FaPlayCircle className="timer-icon play" />
          )}
        </div>
      </div>
    </div>
    
  );
};

export default TaskCard;