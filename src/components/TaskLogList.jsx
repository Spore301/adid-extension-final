import React, { useState, useEffect } from 'react';
import { apiClient } from '../api';

const TimeLogList = ({ taskId }) => {
  const [timeLogs, setTimeLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        // This is the FIX: Destructure the response to get the timeLogs array
        const { timeLogs: logsData = [] } = await apiClient.getTimeLogsForTask(taskId);
        setTimeLogs(logsData);
      } catch (error) {
        console.error("Failed to fetch time logs", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (taskId) {
      fetchLogs();
    }
  }, [taskId]);

  const formatDuration = (ms) => {
    if (!ms) return '0h 0m';
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="timelog-section">
      <h5 className="section-title">Time Logs</h5>
      {isLoading && <p className="empty-state">Loading logs...</p>}
      {!isLoading && timeLogs.length === 0 && <p className="empty-state">No time has been logged for this task yet.</p>}
      {!isLoading && timeLogs.length > 0 && (
        <ul className="timelog-list">
          {timeLogs.map(log => (
            <li key={log._id} className="timelog-item">
              <span className="timelog-user">{log.user?.name || 'Unknown'}</span>
              <span className="timelog-duration">{formatDuration(log.duration)}</span>
              <span className="timelog-time">
                {formatTime(log.startTime)} - {log.endTime ? formatTime(log.endTime) : 'Now'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TimeLogList;