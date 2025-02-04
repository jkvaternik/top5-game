(function () {
  if (!performance || !performance.memory) {
    console.log('Memory API not supported');
    return;
  }

  let memoryLogs = [];

  function logMemoryUsage() {
    const memory = performance.memory;
    const usage = {
      jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1048576),
      totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1048576),
      usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1048576),
      timestamp: new Date().toISOString(),
    };
    memoryLogs.push(usage);

    // Keep only the last 100 logs
    if (memoryLogs.length > 100) {
      memoryLogs.shift();
    }

    console.log(
      `Memory Usage: ${usage.usedJSHeapSize}MB / ${usage.totalJSHeapSize}MB`
    );
  }

  // Log memory usage every 5 seconds
  setInterval(logMemoryUsage, 5000);

  // Function to display memory logs
  window.showMemoryLogs = function () {
    alert(JSON.stringify(memoryLogs, null, 2));
  };
})();

// eslint-disable-next-line import/no-anonymous-default-export
export default {};
