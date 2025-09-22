import React, { useState, useEffect } from 'react';
import { apiClient } from '../api';

const TimeLogList = ({ taskId }) => {
  const [timeLogs, setTimeLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const logs = await apiClient.getTimeLogsForTask(taskId);
        setTimeLogs(logs);
      } catch (error) {
        console.error("Failed to fetch time logs", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [taskId]);

  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="timelog-section">
      <h5 className="section-title">Time Logs</h5>
      {isLoading && <p>Loading logs...</p>}
      {!isLoading && timeLogs.length === 0 && <p className="empty-state">No time logs yet.</p>}
      {!isLoading && timeLogs.length > 0 && (
        <ul className="timelog-list">
          {timeLogs.map(log => (
            <li key={log._id} className="timelog-item">
              <span className="timelog-user">{log.user.name}</span>
              <span className="timelog-duration">{log.formattedDuration}</span>
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