// Saves options to chrome.storage
const saveOptions = () => {
  const backendUrl = document.querySelector('input[name="backend"]:checked').value;
  const isDarkMode = document.getElementById('theme-toggle').checked;
  const theme = isDarkMode ? 'dark' : 'light';

  chrome.storage.local.set(
    { selectedBackend: backendUrl, theme: theme },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 1000);
    }
  );
  // Apply theme to the options page itself
  document.body.className = theme;
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.local.get(
    { selectedBackend: 'https://adid-task-manager.onrender.com', theme: 'light' },
    (items) => {
      // Set backend URL
      document.querySelector(`input[name="backend"][value="${items.selectedBackend}"]`).checked = true;
      
      // Set theme
      const isDarkMode = items.theme === 'dark';
      const toggle = document.getElementById('theme-toggle');
      const label = document.getElementById('theme-label');
      toggle.checked = isDarkMode;
      label.textContent = isDarkMode ? 'Dark Mode' : 'Light Mode';
      document.body.className = items.theme;
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('change', saveOptions);
});