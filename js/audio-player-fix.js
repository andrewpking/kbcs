/**
 * KBCS Audio Player Fix
 * This script ensures that the audio player remains functional throughout page transitions
 * when using Barba.js for a single page application experience.
 */

(function() {
    console.log("[AUDIO DEBUG] Initializing audio player fix script");
    
    // Check if Barba is available
    if (typeof barba === 'undefined') {
        console.error("[AUDIO DEBUG] CRITICAL ERROR: Barba.js is not loaded! Audio continuity during page transitions may not work.");
    } else {
        console.log("[AUDIO DEBUG] Barba.js is available, version:", barba.version || "unknown");
    }
    
    // Global variables
    let persistentAudioPlayer = null;
    let isPlaying = false;
    let currentVolume = 1;
    let isMuted = false;
    let currentTime = 0;
    let audioInterval = null;
    let audioIndicator = null;
    
    // Debug information
    window.audioPlayerDebug = {
        initialized: false,
        playerCreated: false,
        lastAction: null,
        errors: [],
        state: {
            isPlaying: false,
            volume: 1,
            muted: false,
            currentTime: 0
        }
    };
    
    /**
     * Initialize the persistent audio player
     */
    function initPersistentAudioPlayer() {
        console.log("[AUDIO DEBUG] Attempting to initialize persistent audio player");
        
        // Try to find the main audio player from multiple possible sources
        let originalPlayer = document.querySelector('audio#live-stream') || 
                            document.querySelector('audio#live-stream-mobile') ||
                            document.querySelector('audio#original-player-clone');
        
        if (!originalPlayer) {
            console.error("[AUDIO DEBUG] CRITICAL ERROR: Main audio player not found");
            window.audioPlayerDebug.errors.push({
                time: new Date().toISOString(),
                error: "Main audio player not found",
                action: "initPersistentAudioPlayer"
            });
            return;
        }
        
        // If we already have a persistent player, don't create another one
        if (persistentAudioPlayer && document.body.contains(persistentAudioPlayer)) {
            console.log("[AUDIO DEBUG] Persistent player already exists, skipping initialization");
            // Make sure the existing persistent player is visible and active
            persistentAudioPlayer.style.display = 'block';
            persistentAudioPlayer.style.visibility = 'visible';
            stylePlayer(persistentAudioPlayer);
            return;
        }
        
        console.log("[AUDIO DEBUG] Found original player:", originalPlayer.id, "src:", originalPlayer.src);
        
        try {
            // Create a completely new audio element instead of cloning
            persistentAudioPlayer = document.createElement('audio');
            persistentAudioPlayer.id = 'persistent-live-stream';
            persistentAudioPlayer.setAttribute('data-persistent', 'true');
            persistentAudioPlayer.src = originalPlayer.src;
            persistentAudioPlayer.controls = true;
            persistentAudioPlayer.autoplay = false;
            persistentAudioPlayer.crossOrigin = "anonymous";
            
            console.log("[AUDIO DEBUG] Created persistent player with src:", persistentAudioPlayer.src);
            window.audioPlayerDebug.playerCreated = true;
        } catch (error) {
            console.error("[AUDIO DEBUG] Error creating persistent player:", error);
            window.audioPlayerDebug.errors.push({
                time: new Date().toISOString(),
                error: error.toString(),
                action: "createAudioElement"
            });
        }
        
        // Add persistent player to the dedicated container
        try {
            const container = document.getElementById('persistent-audio-container');
            if (container) {
                container.appendChild(persistentAudioPlayer);
                console.log("[AUDIO DEBUG] Added persistent player to container");
            } else {
                // If container doesn't exist, add to body
                document.body.appendChild(persistentAudioPlayer);
                console.log("[AUDIO DEBUG] Container not found, added persistent player to body");
            }
        } catch (error) {
            console.error("[AUDIO DEBUG] Error adding persistent player to DOM:", error);
            window.audioPlayerDebug.errors.push({
                time: new Date().toISOString(),
                error: error.toString(),
                action: "addToDom"
            });
        }
        
        // Clone and preserve the original player instead of just hiding it
        // This prevents it from being removed during navigation
        const originalPlayerClone = originalPlayer.cloneNode(true);
        originalPlayerClone.id = 'original-player-clone';
        document.body.appendChild(originalPlayerClone);
            
        // Now we can modify the original without losing it
        originalPlayer.style.opacity = '0';
        originalPlayer.style.position = 'absolute';
        originalPlayer.style.pointerEvents = 'none';
        
        // Track playback state
        persistentAudioPlayer.addEventListener('play', function() {
            console.log("[AUDIO DEBUG] Audio play event triggered");
            isPlaying = true;
            
            // Update debug state
            window.audioPlayerDebug.state.isPlaying = true;
            window.audioPlayerDebug.lastAction = {
                action: "play",
                time: new Date().toISOString()
            };
            
            // Start tracking current time
            if (audioInterval) {
                clearInterval(audioInterval);
            }
            audioInterval = setInterval(() => {
                currentTime = persistentAudioPlayer.currentTime;
                window.audioPlayerDebug.state.currentTime = currentTime;
            }, 1000);
            
            // Show the indicator
            updateAudioIndicator(true);
        });
        
        persistentAudioPlayer.addEventListener('pause', function() {
            console.log("[AUDIO DEBUG] Audio pause event triggered");
            isPlaying = false;
            
            // Update debug state
            window.audioPlayerDebug.state.isPlaying = false;
            window.audioPlayerDebug.lastAction = {
                action: "pause",
                time: new Date().toISOString()
            };
            
            if (audioInterval) {
                clearInterval(audioInterval);
                audioInterval = null;
            }
            
            // Hide the indicator
            updateAudioIndicator(false);
        });
        
        persistentAudioPlayer.addEventListener('volumechange', function() {
            console.log("[AUDIO DEBUG] Audio volume changed to:", persistentAudioPlayer.volume, "muted:", persistentAudioPlayer.muted);
            currentVolume = persistentAudioPlayer.volume;
            isMuted = persistentAudioPlayer.muted;
            
            // Update debug state
            window.audioPlayerDebug.state.volume = currentVolume;
            window.audioPlayerDebug.state.muted = isMuted;
        });
        
        persistentAudioPlayer.addEventListener('error', function(e) {
            console.error("[AUDIO DEBUG] Audio player error:", e);
            window.audioPlayerDebug.errors.push({
                time: new Date().toISOString(),
                error: "Audio error code: " + (persistentAudioPlayer.error ? persistentAudioPlayer.error.code : "unknown"),
                action: "playback"
            });
        });
        
        // Style the persistent player
        stylePlayer(persistentAudioPlayer);
        
        console.log("[AUDIO DEBUG] Persistent audio player initialization complete");
        window.audioPlayerDebug.initialized = true;
    }
    
    /**
     * Force play on the persistent audio player
     */
    function forcePlay() {
        console.log("[AUDIO DEBUG] Attempting to force play audio");
        
        if (!persistentAudioPlayer) {
            console.error("[AUDIO DEBUG] Cannot force play - persistent player doesn't exist");
            return;
        }
        
        if (persistentAudioPlayer && isPlaying) {
            console.log("[AUDIO DEBUG] Force playing audio...");
            persistentAudioPlayer.play().catch(err => {
                console.error("[AUDIO DEBUG] Could not auto-play audio:", err);
                window.audioPlayerDebug.errors.push({
                    time: new Date().toISOString(),
                    error: "Autoplay failed: " + err.toString(),
                    action: "forcePlay"
                });
                
                // Try again with user interaction
                console.log("[AUDIO DEBUG] Setting up click handler to try play again");
                document.addEventListener('click', function playOnce() {
                    if (persistentAudioPlayer) {
                        console.log("[AUDIO DEBUG] Attempting to play after user interaction");
                        persistentAudioPlayer.play().catch((e) => {
                            console.error("[AUDIO DEBUG] Still couldn't play after user interaction:", e);
                        });
                    }
                    document.removeEventListener('click', playOnce);
                }, { once: true });
            });
        } else {
            console.log("[AUDIO DEBUG] Not forcing play because isPlaying =", isPlaying);
        }
    }
    
    /**
     * Style the persistent audio player
     */
    function stylePlayer(player) {
        player.style.position = 'fixed';
        player.style.bottom = '10px';
        player.style.right = '10px';
        player.style.zIndex = '9999';
        player.style.maxWidth = '300px';
        player.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
        player.style.borderRadius = '4px';
        player.style.display = 'block';
        player.style.visibility = 'visible';
        player.style.opacity = '1';
        
        // Add responsive styles for mobile
        if (window.innerWidth < 768) {
            player.style.maxWidth = '90%';
            player.style.right = '5%';
        }
    }
    
    /**
     * Handle Barba.js transitions
     */
    function setupBarbaHooks() {
        console.log("[AUDIO DEBUG] Setting up Barba hooks");
        
        if (typeof window.barba === 'undefined') {
            console.error("[AUDIO DEBUG] Cannot set up Barba hooks - Barba.js is not loaded!");
            window.audioPlayerDebug.errors.push({
                time: new Date().toISOString(),
                error: "Barba.js not loaded",
                action: "setupBarbaHooks"
            });
            return;
        }
        
        if (window.barba) {
            console.log("[AUDIO DEBUG] Barba is available, setting up hooks");
            
            // Before any transition begins
            window.barba.hooks.before(() => {
                console.log("[AUDIO DEBUG] Barba before hook triggered");
                
                if (persistentAudioPlayer) {
                    // Save current state
                    isPlaying = !persistentAudioPlayer.paused;
                    currentTime = persistentAudioPlayer.currentTime;
                    currentVolume = persistentAudioPlayer.volume;
                    isMuted = persistentAudioPlayer.muted;
                    
                    console.log("[AUDIO DEBUG] Saved audio state:", {
                        isPlaying, currentTime, currentVolume, isMuted
                    });
                    
                    // Update debug state
                    window.audioPlayerDebug.state = {
                        isPlaying, currentTime, currentVolume, isMuted
                    };
                    window.audioPlayerDebug.lastAction = {
                        action: "barba_before",
                        time: new Date().toISOString()
                    };
                    
                    // Store for page reload scenarios
                    localStorage.setItem('kbcs_audio_playing', isPlaying ? 'true' : 'false');
                    localStorage.setItem('kbcs_audio_time', currentTime.toString());
                    localStorage.setItem('kbcs_audio_volume', currentVolume.toString());
                    localStorage.setItem('kbcs_audio_muted', isMuted ? 'true' : 'false');
                } else {
                    console.warn("[AUDIO DEBUG] Before hook: persistentAudioPlayer not found");
                }
            });
            
            // Before leaving the current page - critical for continuous playback
            window.barba.hooks.beforeLeave((data) => {
                console.log("[AUDIO DEBUG] Barba beforeLeave hook triggered");
                
                // Prevent the audio player from being removed during transition
                if (persistentAudioPlayer) {
                    console.log("[AUDIO DEBUG] Moving persistent player to body to prevent destruction");
                    // Move to body to ensure it's not destroyed
                    if (persistentAudioPlayer.parentNode) {
                        try {
                            document.body.appendChild(persistentAudioPlayer);
                            console.log("[AUDIO DEBUG] Successfully moved player to body");
                        } catch (error) {
                            console.error("[AUDIO DEBUG] Error moving player to body:", error);
                            window.audioPlayerDebug.errors.push({
                                time: new Date().toISOString(),
                                error: error.toString(),
                                action: "beforeLeave_moveToBody"
                            });
                        }
                    }
                } else {
                    console.warn("[AUDIO DEBUG] BeforeLeave hook: persistentAudioPlayer not found");
                }
                
                window.audioPlayerDebug.lastAction = {
                    action: "barba_beforeLeave",
                    time: new Date().toISOString()
                };
            });
            
            // After the new page enters
            window.barba.hooks.after(() => {
                console.log("[AUDIO DEBUG] Barba after hook triggered");
                window.audioPlayerDebug.lastAction = {
                    action: "barba_after",
                    time: new Date().toISOString()
                };
                
                // Preserve any new audio player that might have been added
                const newPlayers = document.querySelectorAll('audio#live-stream, audio#live-stream-mobile');
                console.log("[AUDIO DEBUG] Found", newPlayers.length, "new audio players to handle");
                
                newPlayers.forEach(player => {
                    console.log("[AUDIO DEBUG] Preserving new player:", player.id);
                    
                    // Clone the player before hiding it to ensure we keep a copy
                    const playerClone = player.cloneNode(true);
                    playerClone.id = 'original-player-clone';
                    document.body.appendChild(playerClone);
                    
                    // Now hide the original
                    player.style.opacity = '0';
                    player.style.position = 'absolute';
                    player.style.pointerEvents = 'none';
                    player.controls = false; // Disable controls to prevent interaction
                    
                    // Mute to prevent any audio doubling
                    player.muted = true;
                    player.volume = 0;
                });
                
                if (persistentAudioPlayer) {
                    console.log("[AUDIO DEBUG] Persistent player exists, restoring state");
                    // Make sure the persistent player is still visible
                    stylePlayer(persistentAudioPlayer);
                    
                    // Force play if it was playing before
                    if (isPlaying) {
                        console.log("[AUDIO DEBUG] Was playing before, forcing play");
                        forcePlay();
                    } else {
                        console.log("[AUDIO DEBUG] Was not playing before, keeping paused");
                    }
                    
                    // Add back to container if available
                    const container = document.getElementById('persistent-audio-container');
                    if (container && !container.contains(persistentAudioPlayer)) {
                        console.log("[AUDIO DEBUG] Moving player back to container");
                        try {
                            container.appendChild(persistentAudioPlayer);
                        } catch (error) {
                            console.error("[AUDIO DEBUG] Error moving player to container:", error);
                            // If moving fails, make sure it stays in the body
                            if (!document.body.contains(persistentAudioPlayer)) {
                                document.body.appendChild(persistentAudioPlayer);
                            }
                        }
                    }
                } else {
                    console.warn("[AUDIO DEBUG] Lost persistent player, recreating");
                    // If we lost our persistent player, recreate it
                    initPersistentAudioPlayer();
                    
                    // Restore state if needed
                    if (localStorage.getItem('kbcs_audio_playing') === 'true') {
                        console.log("[AUDIO DEBUG] Should be playing according to localStorage, forcing play");
                        isPlaying = true;
                        forcePlay();
                    }
                }
            });
        } else {
            console.error("[AUDIO DEBUG] window.barba exists but is falsy:", window.barba);
        }
    }
    
    /**
     * Update the audio indicator to show playing status
     */
    function updateAudioIndicator(playing) {
        console.log("[AUDIO DEBUG] Updating audio indicator, playing =", playing);
        
        if (!audioIndicator) {
            audioIndicator = document.querySelector('.audio-player-indicator');
            if (!audioIndicator) {
                console.warn("[AUDIO DEBUG] Audio indicator element not found");
            }
        }
        
        if (audioIndicator) {
            if (playing) {
                audioIndicator.classList.add('is-playing');
                audioIndicator.style.display = 'block';
                console.log("[AUDIO DEBUG] Showing audio indicator");
            } else {
                audioIndicator.classList.remove('is-playing');
                console.log("[AUDIO DEBUG] Hiding audio indicator");
            }
            
            // Add debug info to indicator
            if (playing) {
                const debugText = document.createElement('div');
                debugText.style.fontSize = '10px';
                debugText.style.opacity = '0.7';
                debugText.textContent = 'Audio state: ' + (window.barbaLoaded ? 'Barba active' : 'No Barba');
                
                // Replace any existing debug text
                const existingDebug = audioIndicator.querySelector('.debug-info');
                if (existingDebug) {
                    existingDebug.remove();
                }
                
                debugText.className = 'debug-info';
                audioIndicator.appendChild(debugText);
            }
        }
    }
    
    /**
     * Initialize everything when the DOM is ready
     */
    function init() {
        console.log("[AUDIO DEBUG] Initializing audio player system");
        
        // Create debug indicator
        const debugIndicator = document.createElement('div');
        debugIndicator.id = 'audio-debug-indicator';
        debugIndicator.style.position = 'fixed';
        debugIndicator.style.bottom = '40px';
        debugIndicator.style.left = '10px';
        debugIndicator.style.backgroundColor = 'blue';
        debugIndicator.style.color = 'white';
        debugIndicator.style.padding = '5px 10px';
        debugIndicator.style.borderRadius = '4px';
        debugIndicator.style.fontSize = '12px';
        debugIndicator.style.zIndex = '9999';
        debugIndicator.style.opacity = '0.7';
        debugIndicator.textContent = 'Audio Debug: Active';
        document.body.appendChild(debugIndicator);
        
        // Initialize the audio indicator
        audioIndicator = document.querySelector('.audio-player-indicator');
        if (!audioIndicator) {
            console.warn("[AUDIO DEBUG] Audio indicator not found in DOM");
        }
        
        // Check if Barba.js is available
        if (typeof barba === 'undefined') {
            console.error("[AUDIO DEBUG] Barba.js is not available. Audio continuity will be limited.");
            
            // Create an error indicator
            const errorIndicator = document.createElement('div');
            errorIndicator.style.position = 'fixed';
            errorIndicator.style.top = '50px';
            errorIndicator.style.left = '0';
            errorIndicator.style.right = '0';
            errorIndicator.style.backgroundColor = 'red';
            errorIndicator.style.color = 'white';
            errorIndicator.style.padding = '10px';
            errorIndicator.style.zIndex = '9999';
            errorIndicator.style.textAlign = 'center';
            errorIndicator.textContent = 'ERROR: Barba.js not loaded. Audio may stop during navigation.';
            document.body.appendChild(errorIndicator);
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                errorIndicator.style.display = 'none';
            }, 5000);
        } else {
            console.log("[AUDIO DEBUG] Barba.js is available:", barba.version);
        }
        
        // Initialize the persistent player
        initPersistentAudioPlayer();
        
        // Set up Barba.js hooks if available
        setupBarbaHooks();
        
        // Handle window resize for responsive styling
        window.addEventListener('resize', function() {
            if (persistentAudioPlayer) {
                stylePlayer(persistentAudioPlayer);
            }
        });
        
        // Handle page reloads
        window.addEventListener('beforeunload', function() {
            if (persistentAudioPlayer) {
                localStorage.setItem('kbcs_audio_playing', persistentAudioPlayer.paused ? 'false' : 'true');
                localStorage.setItem('kbcs_audio_time', persistentAudioPlayer.currentTime.toString());
                localStorage.setItem('kbcs_audio_volume', persistentAudioPlayer.volume.toString());
                localStorage.setItem('kbcs_audio_muted', persistentAudioPlayer.muted.toString());
            }
        });
        
        // Restore state on page load
        window.addEventListener('load', function() {
            if (persistentAudioPlayer) {
                const wasPlaying = localStorage.getItem('kbcs_audio_playing') === 'true';
                const time = parseFloat(localStorage.getItem('kbcs_audio_time') || '0');
                const volume = parseFloat(localStorage.getItem('kbcs_audio_volume') || '1');
                const muted = localStorage.getItem('kbcs_audio_muted') === 'true';
                
                persistentAudioPlayer.volume = volume;
                persistentAudioPlayer.muted = muted;
                
                // Set time and play if needed
                if (time > 0) {
                    persistentAudioPlayer.currentTime = time;
                }
                
                if (wasPlaying) {
                    persistentAudioPlayer.play().catch(() => {
                        // If autoplay fails due to browser policies, add a one-time click handler
                        document.addEventListener('click', function resumeOnce() {
                            persistentAudioPlayer.play().catch(() => {});
                            document.removeEventListener('click', resumeOnce);
                        }, { once: true });
                    });
                    
                    // Show the indicator
                    updateAudioIndicator(true);
                } else {
                    // Hide the indicator
                    updateAudioIndicator(false);
                }
            }
        });
        
        // Additional fix for Barba.js links - prevent default on live stream links
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a');
            if (target && target.href && (
                target.href.includes('streamkbcs.pacificaservice.org') || 
                target.href.includes('radiorethink.com')
            )) {
                e.preventDefault();
                e.stopPropagation();
                
                // Instead of navigating, just play our persistent player
                if (persistentAudioPlayer) {
                    persistentAudioPlayer.play().catch(() => {});
                    updateAudioIndicator(true);
                }
                
                return false;
            }
        });
    }
    
    // Run initialization when DOM is ready
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also try to run after a delay in case the player is added dynamically
    setTimeout(init, 1000);
    
    // Re-initialize after each navigation to ensure the player persists
    if (typeof window.barba !== 'undefined') {
        window.barba.hooks.after(function() {
            console.log("[AUDIO DEBUG] Re-initializing after page transition");
            // Short delay to ensure the new DOM is ready
            setTimeout(function() {
                // Check if our persistent player is still in the DOM
                if (!persistentAudioPlayer || !document.body.contains(persistentAudioPlayer)) {
                    console.log("[AUDIO DEBUG] Player lost during transition, recreating");
                    initPersistentAudioPlayer();
                } else {
                    // Just ensure it's visible
                    stylePlayer(persistentAudioPlayer);
                    
                    // Resume playback if it was playing before
                    if (isPlaying && persistentAudioPlayer.paused) {
                        persistentAudioPlayer.play().catch(() => {});
                    }
                }
            }, 100);
        });
    }
    
    // Ensure continued playback by checking every few seconds
    setInterval(function() {
        // First make sure our persistent player still exists
        if (!persistentAudioPlayer || !document.body.contains(persistentAudioPlayer)) {
            console.log("[AUDIO DEBUG] Persistent player not found, recreating...");
            initPersistentAudioPlayer();
            return;
        }
        
        // Then check if it should be playing but isn't
        if (persistentAudioPlayer && isPlaying && persistentAudioPlayer.paused) {
            console.log('[AUDIO DEBUG] Detected paused player that should be playing - attempting to resume');
            persistentAudioPlayer.play().catch(() => {});
        }
        
        // Keep indicator in sync with actual playback state
        if (persistentAudioPlayer) {
            updateAudioIndicator(!persistentAudioPlayer.paused);
        }
        
        // Make sure the player is visible
        if (persistentAudioPlayer && persistentAudioPlayer.style.display !== 'block') {
            stylePlayer(persistentAudioPlayer);
        }
    }, 1000);
    
    // Set a global flag to indicate our audio fix is active
    window.kbcsAudioFixed = true;
    
    // Add a debug console function
    window.debugAudioPlayer = function() {
        console.log("==== AUDIO PLAYER DEBUG INFO ====");
        console.log("Audio fixed:", window.kbcsAudioFixed);
        console.log("Barba available:", typeof barba !== 'undefined');
        console.log("Barba loaded:", window.barbaLoaded || false);
        console.log("Persistent player exists:", !!persistentAudioPlayer);
        console.log("Is playing:", isPlaying);
        console.log("Current time:", currentTime);
        console.log("Volume:", currentVolume);
        console.log("Muted:", isMuted);
        console.log("Debug state:", window.audioPlayerDebug);
        console.log("=========================");
        
        return {
            audioFixed: window.kbcsAudioFixed,
            barbaAvailable: typeof barba !== 'undefined',
            barbaLoaded: window.barbaLoaded || false,
            playerExists: !!persistentAudioPlayer,
            isPlaying: isPlaying,
            currentTime: currentTime,
            volume: currentVolume,
            muted: isMuted,
            debugState: window.audioPlayerDebug
        };
    };
    
    console.log("[AUDIO DEBUG] Audio player fix script loaded and initialized");
})();