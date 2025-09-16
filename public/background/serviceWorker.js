const SYNC_ALARM_NAME = 'adid-task-sync-alarm';

// --- API Helper ---
// A simplified fetch utility for the background worker.
async function sendRequest(request) {
  try {
    const response = await fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    // If the request is successful (e.g., status 200 OK), it's considered sent.
    return response.ok;
  } catch (error) {
    // Any network error means we're likely offline.
    console.log('Sync failed, probably offline.', error);
    return false;
  }
}

// --- Queue Management ---
async function processQueue() {
  console.log('Processing offline request queue...');
  const { requestQueue = [] } = await chrome.storage.local.get('requestQueue');
  
  if (requestQueue.length === 0) {
    console.log('Queue is empty. Nothing to sync.');
    return;
  }

  const successfullySent = [];
  for (const request of requestQueue) {
    const isSuccess = await sendRequest(request);
    if (isSuccess) {
      successfullySent.push(request.id);
    }
  }

  // Remove successfully sent requests from the queue
  if (successfullySent.length > 0) {
    const newQueue = requestQueue.filter(req => !successfullySent.includes(req.id));
    await chrome.storage.local.set({ requestQueue: newQueue });
    console.log(`Synced ${successfullySent.length} requests. ${newQueue.length} remaining.`);
  }
}

// --- Alarm Setup ---
// Create an alarm when the extension is installed or updated.
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(SYNC_ALARM_NAME, {
    delayInMinutes: 1, // Wait 1 minute before first run
    periodInMinutes: 5, // Then run every 5 minutes
  });
  console.log('Sync alarm created.');
});

// Listen for the alarm and process the queue when it fires.
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === SYNC_ALARM_NAME) {
    processQueue();
  }
});