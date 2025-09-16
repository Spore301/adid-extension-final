import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import TaskListView from './TaskListView';
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for a logged-in user and theme when the popup opens
  useEffect(() => {
    chrome.storage.local.get(['user', 'theme'], (result) => {
      // Set user if found in storage
      if (result.user) {
        setUser(result.user);
      }
      
      // Apply theme from storage
      if (result.theme === 'dark') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }

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
    return <div className="app-container loading"><h2>Loading...</h2></div>;
  }
  
  return (
    <div>
      <Toaster />
      {user ? (
        <TaskListView user={user} onLogout={handleLogout} />
      ) : (
        <div className="app-container">
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      )}
    </div>
  );
}

export default App;