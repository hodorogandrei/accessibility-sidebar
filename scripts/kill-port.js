#!/usr/bin/env node

/**
 * Kill process running on specified port
 * Usage: node kill-port.js <port>
 */

const { execSync } = require('child_process');
const port = process.argv[2] || 8080;

function killPort(port) {
  try {
    // Try to find process using the port
    if (process.platform === 'darwin' || process.platform === 'linux') {
      // macOS and Linux
      try {
        const pid = execSync(`lsof -t -i:${port}`, { encoding: 'utf8' }).trim();
        if (pid) {
          console.log(`Killing process ${pid} on port ${port}...`);
          execSync(`kill -9 ${pid}`);
          console.log(`✓ Port ${port} cleared`);
        }
      } catch (e) {
        // No process found on port
        console.log(`✓ Port ${port} is already free`);
      }
    } else if (process.platform === 'win32') {
      // Windows
      try {
        const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
        const lines = output.trim().split('\n');
        const pids = new Set();
        
        lines.forEach(line => {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0') {
            pids.add(pid);
          }
        });
        
        pids.forEach(pid => {
          console.log(`Killing process ${pid} on port ${port}...`);
          try {
            execSync(`taskkill /PID ${pid} /F`);
          } catch (e) {
            // Process might already be killed
          }
        });
        
        if (pids.size > 0) {
          console.log(`✓ Port ${port} cleared`);
        } else {
          console.log(`✓ Port ${port} is already free`);
        }
      } catch (e) {
        // No process found on port
        console.log(`✓ Port ${port} is already free`);
      }
    }
  } catch (error) {
    console.error(`Error clearing port ${port}:`, error.message);
    process.exit(1);
  }
}

// Kill the port
killPort(port);