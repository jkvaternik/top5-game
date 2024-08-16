// Create a container for storing logs
let logs = [];

// Function to display logs in an alert
function showLogs() {
  if (logs.length > 0) {
    alert(logs.join('\n'));
    logs = []; // Clear logs after displaying
  }
}

// Override console methods
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info
};

console.error = function () {
  logs.push('ERROR: ' + Array.from(arguments).join(' '));
  originalConsole.error.apply(console, arguments);
};

console.warn = function () {
  logs.push('WARN: ' + Array.from(arguments).join(' '));
  originalConsole.warn.apply(console, arguments);
};

// Capture unhandled errors
window.onerror = function (message, source, lineno, colno, error) {
  logs.push('UNHANDLED ERROR: ' + message + ' at ' + source + ':' + lineno + ':' + colno);
  return false;
};

// Capture unhandled promise rejections
window.addEventListener('unhandledrejection', function (event) {
  logs.push('UNHANDLED PROMISE REJECTION: ' + event.reason);
});

// Display logs every 5 seconds if there are any
setInterval(showLogs, 5000);

// You can also expose a global function to show logs on demand
window.showErrorLogs = showLogs;

// eslint-disable-next-line import/no-anonymous-default-export
export default {};