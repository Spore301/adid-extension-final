import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import TaskListView from './TaskListView';
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // This hook now safely checks for a user and theme
  useEffect(() => {
    chrome.storage.local.get(['user', 'theme'], (result) => {
      // Set user if found in storage
      if (result.user) {
        setUser(result.user);
      }
      
      // Apply theme from storage, regardless of login state
      if (result.theme === 'dark') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }

      // We are done loading
      setIsLoading(false);
    });
  }, []);

  const handleLoginSuccess = (userData) => {
    chrome.storage.local.set({ user: userData }, () => {
      setUser(userData);
    });
  };

  const handleLogout = () => {
    chrome.storage.local.remove(['user'], () => {
      setUser(null);
    });
  };

  if (isLoading) {
    return <div className="loading-container"><h2>Loading...</h2></div>;
  }
  
  return (
    <>
      <Toaster />
      {user ? (
        <TaskListView user={user} onLogout={handleLogout} />
      ) : (
        <div className="login-form-wrapper">
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      )}
    </>
  );
}

export default App;