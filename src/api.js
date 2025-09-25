import { API_PATHS } from './utils/apiPaths.js';

const DEFAULT_URL = "https://adid-task-manager.onrender.com";

// --- START: FIX ---
// Move this helper function to the top-level scope of the file.
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
        if (error.name !== 'AbortError') {
          reject(error);
        }
      });
  });
};
// --- END: FIX ---

const getBaseUrl = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get({ selectedBackend: DEFAULT_URL }, (items) => {
      resolve(items.selectedBackend);
    });
  });
};

const getToken = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['user'], (result) => {
      resolve(result.user ? result.user.token : null);
    });
  });
};

const request = async (endpoint, options = {}) => {
  const baseUrl = await getBaseUrl();
  const token = await getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // The 'request' function no longer needs fetchWithTimeout inside it
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }

  return response.json();
};

export const apiClient = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  getTimeLogsForTask: (taskId) => request(API_PATHS.TASKS.GET_TASK_TIMELOGS(taskId)),
  addRemarkToTask: (taskId, remarkData) => request(API_PATHS.TASKS.ADD_REMARK(taskId), {
    method: 'POST',
    body: JSON.stringify(remarkData),
  }),
};

// ... (keep all existing code for apiClient) ...

// --- START: NEW MUSIC API CLIENT ---
// --- START: NEW MUSIC API CLIENT ---
const MUSIC_DEFAULT_URL = "music-backend-j1a8ee2ov-debarghas-projects-c07a3f0b.vercel.app"; // Replace with your deployed URL

const getMusicBaseUrl = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get({ selectedMusicBackend: MUSIC_DEFAULT_URL }, (items) => {
      resolve(items.selectedMusicBackend);
    });
  });
};

const musicRequest = async (endpoint, options = {}) => {
  const baseUrl = await getMusicBaseUrl();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  
  const response = await fetch(`${baseUrl}${endpoint}`, { ...options, headers });
  if (!response.ok) {
      // If the response is not JSON, it might be an HTML error page.
      const text = await response.text();
      try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || 'Music API request failed');
      } catch (e) {
           // This will catch the "Unexpected token '<'" error and provide a better message.
          throw new Error('Received an invalid response from the music server. Is it running?');
      }
  }
  return response.json();
};

export const musicApiClient = {
    post: (endpoint, body) => musicRequest(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    get: (endpoint) => musicRequest(endpoint),
};


export async function loginUser(email, password) {
  const baseUrl = await getBaseUrl();
  
  // Now this function can correctly see and call fetchWithTimeout
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