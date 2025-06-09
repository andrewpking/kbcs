/**
 * Barba.js Loader Check
 * This script runs as early as possible to diagnose if Barba.js is loading correctly
 */

(function() {
    console.log("[BARBA LOADER CHECK] Script initialized at", new Date().toISOString());

    // Store original console methods
    const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn
    };

    // Log buffer to capture messages
    window.barbaLoaderLogs = [];

    // Override console methods to capture logs
    console.log = function() {
        window.barbaLoaderLogs.push({
            type: 'log',
            time: new Date().toISOString(),
            args: Array.from(arguments)
        });
        originalConsole.log.apply(console, arguments);
    };

    console.error = function() {
        window.barbaLoaderLogs.push({
            type: 'error',
            time: new Date().toISOString(),
            args: Array.from(arguments)
        });
        originalConsole.error.apply(console, arguments);
    };

    console.warn = function() {
        window.barbaLoaderLogs.push({
            type: 'warn',
            time: new Date().toISOString(),
            args: Array.from(arguments)
        });
        originalConsole.warn.apply(console, arguments);
    };

    // Check if Barba.js loads within timeout period
    const checkBarbaLoaded = function() {
        if (typeof barba !== 'undefined') {
            console.log("[BARBA LOADER CHECK] Barba.js successfully loaded:", barba.version);
            clearTimeout(barbaTimeout);
            document.dispatchEvent(new CustomEvent('barba-loaded'));
            return true;
        }
        return false;
    };

    // Create DOM element for visual feedback
    const createStatusElement = function() {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'barba-loader-status';
        statusDiv.style.position = 'fixed';
        statusDiv.style.top = '10px';
        statusDiv.style.right = '10px';
        statusDiv.style.backgroundColor = '#ffcc00';
        statusDiv.style.color = '#000';
        statusDiv.style.padding = '5px 10px';
        statusDiv.style.borderRadius = '4px';
        statusDiv.style.fontSize = '12px';
        statusDiv.style.zIndex = '10000';
        statusDiv.style.opacity = '0.9';
        statusDiv.style.transition = 'background-color 0.5s';
        statusDiv.textContent = 'Checking Barba.js...';
        
        // Add a close button
        const closeBtn = document.createElement('span');
        closeBtn.textContent = '×';
        closeBtn.style.marginLeft = '10px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.onclick = function() {
            statusDiv.style.display = 'none';
        };
        statusDiv.appendChild(closeBtn);
        
        document.body.appendChild(statusDiv);
        return statusDiv;
    };

    // Update status element with result
    const updateStatus = function(success, message) {
        const statusDiv = document.getElementById('barba-loader-status');
        if (!statusDiv) return;
        
        statusDiv.style.backgroundColor = success ? '#4CAF50' : '#F44336';
        statusDiv.style.color = '#fff';
        statusDiv.textContent = message;
        
        // Re-add close button
        const closeBtn = document.createElement('span');
        closeBtn.textContent = '×';
        closeBtn.style.marginLeft = '10px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.onclick = function() {
            statusDiv.style.display = 'none';
        };
        statusDiv.appendChild(closeBtn);
        
        // Auto-hide after 10 seconds
        setTimeout(function() {
            statusDiv.style.opacity = '0';
            setTimeout(function() {
                statusDiv.style.display = 'none';
            }, 500);
        }, 10000);
    };

    // Check for script loading issues
    const diagnoseScriptIssues = function() {
        const scripts = document.querySelectorAll('script');
        let barbaScriptFound = false;
        let gsapScriptFound = false;
        let barbaTransitionsFound = false;
        
        scripts.forEach(script => {
            const src = script.src.toLowerCase();
            if (src.includes('barba.umd.js') || src.includes('@barba/core')) {
                barbaScriptFound = true;
            }
            if (src.includes('gsap')) {
                gsapScriptFound = true;
            }
            if (src.includes('barba-transitions.js')) {
                barbaTransitionsFound = true;
            }
        });
        
        return {
            barbaScriptFound,
            gsapScriptFound,
            barbaTransitionsFound
        };
    };

    // Display detailed diagnostic information
    const showDiagnosticInfo = function() {
        const issues = diagnoseScriptIssues();
        
        let message = "Barba.js failed to load properly.\n\n";
        
        // Analyze what went wrong
        if (!issues.barbaScriptFound) {
            message += "- Barba.js script tag is missing from the page\n";
        }
        if (!issues.gsapScriptFound) {
            message += "- GSAP library script is missing (dependency of Barba.js)\n";
        }
        if (!issues.barbaTransitionsFound) {
            message += "- Custom barba-transitions.js script is missing\n";
        }
        
        // Add possible solutions
        message += "\nPossible solutions:\n";
        message += "1. Check if scripts are being blocked by browser extensions\n";
        message += "2. Verify that WordPress is correctly enqueuing scripts\n";
        message += "3. Check browser console for JavaScript errors\n";
        
        console.error("[BARBA LOADER CHECK] Diagnostic results:", issues);
        
        // Create a more detailed error report on the page
        const reportDiv = document.createElement('div');
        reportDiv.style.position = 'fixed';
        reportDiv.style.top = '50%';
        reportDiv.style.left = '50%';
        reportDiv.style.transform = 'translate(-50%, -50%)';
        reportDiv.style.width = '80%';
        reportDiv.style.maxWidth = '600px';
        reportDiv.style.backgroundColor = '#fff';
        reportDiv.style.color = '#333';
        reportDiv.style.padding = '20px';
        reportDiv.style.borderRadius = '8px';
        reportDiv.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        reportDiv.style.zIndex = '10001';
        reportDiv.style.maxHeight = '80vh';
        reportDiv.style.overflow = 'auto';
        
        reportDiv.innerHTML = `
            <h2 style="margin-top:0;color:#F44336;">Barba.js Error Report</h2>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <div>
                <h3>Script Status:</h3>
                <ul>
                    <li>Barba.js script: ${issues.barbaScriptFound ? '✅ Found' : '❌ Missing'}</li>
                    <li>GSAP script: ${issues.gsapScriptFound ? '✅ Found' : '❌ Missing'}</li>
                    <li>barba-transitions.js: ${issues.barbaTransitionsFound ? '✅ Found' : '❌ Missing'}</li>
                </ul>
            </div>
            <button id="close-report" style="background:#F44336;color:white;border:none;padding:8px 15px;border-radius:4px;cursor:pointer;float:right;">Close</button>
            <div style="clear:both;"></div>
        `;
        
        document.body.appendChild(reportDiv);
        
        document.getElementById('close-report').addEventListener('click', function() {
            reportDiv.style.display = 'none';
        });
        
        return message;
    };

    // Set timeout to check if Barba loaded
    const barbaTimeout = setTimeout(function() {
        if (!checkBarbaLoaded()) {
            console.error("[BARBA LOADER CHECK] Barba.js failed to load within timeout period");
            
            const statusElement = document.getElementById('barba-loader-status') || createStatusElement();
            const diagnosticMessage = showDiagnosticInfo();
            updateStatus(false, "Barba.js failed to load!");
            
            // Create a global helper function to manually check Barba
            window.checkBarbaStatus = function() {
                if (typeof barba !== 'undefined') {
                    console.log("[BARBA LOADER CHECK] Barba.js is now available:", barba.version);
                    updateStatus(true, "Barba.js loaded late: " + barba.version);
                    return true;
                } else {
                    console.error("[BARBA LOADER CHECK] Barba.js is still not available");
                    return false;
                }
            };
        }
    }, 5000); // 5 second timeout

    // Run initial check if DOM is already loaded
    if (document.readyState !== 'loading') {
        const statusElement = createStatusElement();
        if (checkBarbaLoaded()) {
            updateStatus(true, "Barba.js loaded: " + barba.version);
        }
    } else {
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', function() {
            const statusElement = createStatusElement();
            if (checkBarbaLoaded()) {
                updateStatus(true, "Barba.js loaded: " + barba.version);
            }
        });
    }

    // Expose diagnostic function globally
    window.diagnoseBarba = function() {
        const issues = diagnoseScriptIssues();
        const barbaLoaded = typeof barba !== 'undefined';
        
        return {
            barbaLoaded,
            barbaVersion: barbaLoaded ? barba.version : null,
            scriptIssues: issues,
            logs: window.barbaLoaderLogs
        };
    };

    console.log("[BARBA LOADER CHECK] Setup complete, waiting for Barba.js to load");
})();