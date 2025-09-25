// Function to save options to chrome.storage
const saveOptions = () => {
  const backendUrl = document.querySelector('input[name="backend"]:checked').value;
  const isDarkMode = document.getElementById('theme-toggle').checked;
  const theme = isDarkMode ? 'dark' : 'light';

  // This part updates the label text immediately when saving.
  const label = document.getElementById('theme-label');
  label.textContent = isDarkMode ? 'Dark Mode' : 'Light Mode';

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
  
  // Apply the theme to the options page itself for immediate feedback
  document.body.className = theme;
};

// Function to restore options from chrome.storage
const restoreOptions = () => {
  chrome.storage.local.get(
    { selectedBackend: 'https://adid-task-manager.onrender.com', theme: 'light' },
    (items) => {
      // Restore backend URL selection
      const backendRadio = document.querySelector(`input[name="backend"][value="${items.selectedBackend}"]`);
      if (backendRadio) {
        backendRadio.checked = true;
      }
      
      // Restore theme selection
      const isDarkMode = items.theme === 'dark';
      const toggle = document.getElementById('theme-toggle');
      const label = document.getElementById('theme-label');
      
      toggle.checked = isDarkMode;
      label.textContent = isDarkMode ? 'Dark Mode' : 'Light Mode';
      document.body.className = items.theme;
    }
  );
};

// Add event listeners once the DOM is loaded
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('change', saveOptions);
});