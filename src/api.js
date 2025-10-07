import { API_PATHS } from './utils/apiPaths.js';

const DEFAULT_URL = "https://adid-task-manager.onrender.com";

// --- New, more reliable timeout utility ---
const fetchWithTimeout = (url, options = {}, timeout = 15000) => {
  const controller = new AbortController();
  options.signal = controller.signal;

  const timeoutPromise = new Promise((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      controller.abort();
      reject(new Error('SERVER_ASLEEP'));
    }, timeout);
  });

  // Race the actual fetch against our timeout promise
  return Promise.race([
    fetch(url, options),
    timeoutPromise
  ]);
};

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
  const baseUrl = await getBaseUrl();
  const token = await getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${baseUrl}${endpoint}`, { ...options, headers });
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
};

// --- Updated loginUser function to use the timeout ---
export async function loginUser(email, password) {
  const baseUrl = await getBaseUrl();
  const response = await fetchWithTimeout( // Using the new function
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