import React, { useState, useEffect, useRef } from 'react';
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa';
import { LuClipboardCheck, LuSquare } from 'react-icons/lu';
import toast from 'react-hot-toast';

// --- START: ADD THESE IMPORTS ---
import TimeLogList from './TaskLogList';
import RemarksSection from './RemarksSection';
// --- END: ADD THESE IMPORTS ---

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

const TaskCard = ({ task, onChecklistToggle, onRemarkAdded, currentUser }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerIntervalRef = useRef(null);

  const startTicking = (startTime) => {
    clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setElapsedTime(Date.now() - new Date(startTime).getTime());
    }, 1000);
  };

  useEffect(() => {
    // Check if chrome.runtime is available before sending a message
    if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(
        { action: "getTimerState", taskId: task._id },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
          }
          if (response && response.isTimerActive) {
            setIsTimerActive(true);
            startTicking(response.startTime);
          }
        }
      );
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [task._id]);

  const handleTimerClick = (e) => {
    e.stopPropagation();
    if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
        if (isTimerActive) {
          chrome.runtime.sendMessage({ action: "stopTimer", task, token: currentUser.token });
          setIsTimerActive(false);
          clearInterval(timerIntervalRef.current);
          setElapsedTime(0);
          toast.success("Timer stopped!");
        } else {
          chrome.runtime.sendMessage({ action: "startTimer", task, token: currentUser.token });
          setIsTimerActive(true);
          startTicking(Date.now());
          toast.success("Timer started!");
        }
    }
  };
  
  const { title, project, status, priority, progress = 0, dueDate, createdAt, todoChecklist = [], remarks = [], isOverdue } = task;
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
        <div className="progress-bar-background"><div className="progress-bar-foreground" style={{ width: `${progress}%` }}></div></div>
      </div>

      {isExpanded && (
        <div className="expanded-content">
          <h5 className="checklist-title">Checklist</h5>
          {todoChecklist.length > 0 ? (
            <ul className="checklist">
              {todoChecklist.map((item) => (
                <li key={item._id} className="checklist-item" onClick={(e) => { e.stopPropagation(); onChecklistToggle(task._id, item._id); }}>
                  {item.completed ? <LuClipboardCheck className="check-icon completed" /> : <LuSquare className="check-icon" />}
                  <span className={item.completed ? 'completed-text' : ''}>{item.text}</span>
                </li>
              ))}
            </ul>
          ) : <p className="no-checklist">No checklist items.</p>}

          <TimeLogList taskId={task._id} />
          <RemarksSection taskId={task._id} remarks={remarks} onRemarkAdded={onRemarkAdded} currentUser={currentUser} />
        </div>
      )}

      <div className="card-footer">
        <div className="date-container">
          <div><label>Start Date</label><p>{formatDate(createdAt)}</p></div>
          <div><label>Due Date</label><p>{formatDate(dueDate)}</p></div>
        </div>
        <div className="timer-controls" onClick={handleTimerClick}>
          {isTimerActive && <span className="timer-display">{formatDuration(elapsedTime)}</span>}
          {isTimerActive ? <FaPauseCircle className="timer-icon stop" /> : <FaPlayCircle className="timer-icon play" />}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;