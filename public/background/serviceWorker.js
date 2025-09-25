const SYNC_ALARM_NAME = 'adid-task-sync-alarm';
const BASE_URL = "https://adid-task-manager.onrender.com";

// --- API Helper ---
async function sendRequest(request) {
  try {
    const response = await fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    return response.ok;
  } catch (error) {
    console.log('Sync failed, probably offline.', error);
    return false;
  }
}

// --- Queue Management ---
async function processQueue() {
  const { requestQueue = [] } = await chrome.storage.local.get('requestQueue');
  if (requestQueue.length === 0) return;

  const successfullySent = [];
  for (const request of requestQueue) {
    if (await sendRequest(request)) {
      successfullySent.push(request.id);
    }
  }

  if (successfullySent.length > 0) {
    const newQueue = requestQueue.filter(req => !successfullySent.includes(req.id));
    await chrome.storage.local.set({ requestQueue: newQueue });
  }
}

// --- Alarm Setup ---
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(SYNC_ALARM_NAME, { periodInMinutes: 5 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === SYNC_ALARM_NAME) processQueue();
});

// --- START: THIS ENTIRE SECTION WAS MISSING ---

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startTimer") {
    startTimer(request.task, request.token);
  } else if (request.action === "stopTimer") {
    stopTimer(request.task, request.token);
  } else if (request.action === "getTimerState") {
    getTimerState(request.taskId, sendResponse);
    return true; // Indicates asynchronous response
  }
});

async function startTimer(task, token) {
  const { runningTimers = {} } = await chrome.storage.local.get('runningTimers');
  if (runningTimers[task._id]) return;

  try {
    const response = await fetch(`${BASE_URL}/api/tasks/${task._id}/timelogs/start`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const { timeLog } = await response.json();

    runningTimers[task._id] = {
      startTime: Date.now(),
      timeLogId: timeLog._id,
    };
    await chrome.storage.local.set({ runningTimers });
  } catch (error) {
    console.error('Failed to start timer:', error);
  }
}

async function stopTimer(task, token) {
  const { runningTimers = {} } = await chrome.storage.local.get('runningTimers');
  const timer = runningTimers[task._id];
  if (!timer) return;

  try {
    await fetch(`${BASE_URL}/api/tasks/${task._id}/timelogs/${timer.timeLogId}/stop`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    delete runningTimers[task._id];
    await chrome.storage.local.set({ runningTimers });
  } catch (error) {
    console.error('Failed to stop timer:', error);
  }
}

async function getTimerState(taskId, sendResponse) {
  const { runningTimers = {} } = await chrome.storage.local.get('runningTimers');
  const timer = runningTimers[taskId];
  if (timer) {
    sendResponse({ isTimerActive: true, startTime: timer.startTime });
  } else {
    sendResponse({ isTimerActive: false });
  }
}
// --- END: MISSING SECTION ---