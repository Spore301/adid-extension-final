import { API_PATHS } from './utils/apiPaths.js';

// Default URL if nothing is set in options yet
const DEFAULT_URL = "https://adid-task-manager.onrender.com";

// Helper to get the currently selected backend URL from storage
const getBaseUrl = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get({ selectedBackend: DEFAULT_URL }, (items) => {
      resolve(items.selectedBackend);
    });
  });
};

// Helper to get the user token from Chrome's storage
const getToken = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['user'], (result) => {
      resolve(result.user ? result.user.token : null);
    });
  });
};

const request = async (endpoint, options = {}) => {
  // Dynamically get the base URL and token before each request
  const baseUrl = await getBaseUrl();
  const token = await getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }

  const fetchWithTimeout = (url, options = {}, timeout = 15000) => {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    options.signal = controller.signal;

    const timeoutId = setTimeout(() => {
      controller.abort();
      // This specific error message will be caught by the login form
      reject(new Error('SERVER_ASLEEP'));
    }, timeout);

    fetch(url, options)
      .then(response => {
        clearTimeout(timeoutId);
        resolve(response);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        // Don't reject twice if it's an abort error
        if (error.name !== 'AbortError') {
          reject(error);
        }
      });
  });
};

  return response.json();
};

export const apiClient = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),

  getTimeLogsForTask: (taskId) => request(API_PATHS.TASKS.GET_TASK_TIMELOGS(taskId)),
  
  // New function to add a remark (comment)
  addRemarkToTask: (taskId, remarkData) => request(API_PATHS.TASKS.ADD_REMARK(taskId), {
    method: 'POST',
    body: JSON.stringify(remarkData),
    }),
};

// The login function also needs to use the dynamic URL
export async function loginUser(email, password) {
  const baseUrl = await getBaseUrl();
  const response = await fetchWithTimeout(
    `${baseUrl}${API_PATHS.AUTH.LOGIN}`, 
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }
  return response.json();
}