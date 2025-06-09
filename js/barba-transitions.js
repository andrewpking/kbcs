/**
 * KBCS Barba.js Transitions
 * Handles page transitions while preserving audio player state
 * Implements WordPress-compatible transitions with GSAP animations
 */

((window) => {
  "use strict";

  // Store references to key elements and states
  let state = {
    audioPlayer: null,
    audioState: null,
    jQueryPlugins: null,
    isTransitioning: false,
  };

  /**
   * Ensure jQuery plugins are available after transitions
   */
  function ensureJQueryPlugins() {
    if (typeof jQuery === "undefined") {
      console.warn("[Barba] jQuery not available");
      return;
    }

    // Ensure jQuery is accessible via $barba
    window.$barba = window.jQuery;

    // Restore plugins if they were saved
    if (state.jQueryPlugins) {
      Object.keys(state.jQueryPlugins).forEach((plugin) => {
        if (!jQuery.fn[plugin] && window.kbcsJQuery?.fn?.[plugin]) {
          jQuery.fn[plugin] = window.kbcsJQuery.fn[plugin];
        }
      });
    }
  }

  /**
   * Save the current state of the audio player
   */
  function preserveAudioPlayer() {
    const player = document.getElementById("persistent-live-stream");
    if (!player) return;

    // Store player reference
    state.audioPlayer = player;

    // Save playback state
    state.audioState = {
      playing: !player.paused,
      currentTime: player.currentTime,
      volume: player.volume,
      muted: player.muted,
    };

    // Ensure player is in the body for preservation
    if (player.parentNode !== document.body) {
      document.body.appendChild(player);
    }

    // Notify audio handler
    document.dispatchEvent(new CustomEvent("barba-audio-transition-start"));
  }

  /**
   * Restore audio player state after transition
   */
  function restoreAudioPlayer() {
    const player =
      state.audioPlayer || document.getElementById("persistent-live-stream");
    if (!player) return;

    // Ensure visibility
    Object.assign(player.style, {
      display: "block",
      visibility: "visible",
      opacity: "1",
    });

    // Restore playback if it was playing
    if (state.audioState?.playing && player.paused) {
      player
        .play()
        .catch((err) => console.warn("[Barba] Error resuming audio:", err));
    }

    // Handle any duplicate players on the new page
    document
      .querySelectorAll("audio:not([data-persistent])")
      .forEach((newPlayer) => {
        Object.assign(newPlayer.style, {
          opacity: "0",
          position: "absolute",
          pointerEvents: "none",
        });
        newPlayer.muted = true;
        newPlayer.volume = 0;
        newPlayer.controls = false;
      });
  }

  /**
   * Initialize Barba transitions
   */
  function initTransitions() {
    // Save initial jQuery plugins state
    if (typeof jQuery !== "undefined") {
      state.jQueryPlugins = {};
      Object.keys(jQuery.fn).forEach((key) => {
        if (typeof jQuery.fn[key] === "function") {
          state.jQueryPlugins[key] = true;
        }
      });
    }

    // Define the main transition
    barba.hooks.before(() => {
      state.isTransitioning = true;
      document.body.classList.add("is-transitioning");
      preserveAudioPlayer();
    });

    barba.hooks.after((data) => {
      state.isTransitioning = false;
      document.body.classList.remove("is-transitioning");

      // Load and evaluate new scripts
      const newImports = [];
      let newEvaluations = "";
      const scriptTags = data.next.container.getElementsByTagName("script");

      Array.from(scriptTags).forEach((script) => {
        const src = script.getAttribute("src");
        if (src) {
          if (!runningScripts.includes(src)) {
            newImports.push(src);
            runningScripts.push(src);
          }
        } else {
          newEvaluations += script.innerHTML + "\n";
        }
      });

      // Load new scripts sequentially
      const loadScripts = async () => {
        for (const src of newImports) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        // Evaluate inline scripts
        if (newEvaluations) {
          try {
            eval(newEvaluations);
          } catch (error) {
            console.warn("Error evaluating inline scripts:", error);
          }
        }
      };

      // Execute all initialization steps
      loadScripts().then(() => {
        ensureJQueryPlugins();
        restoreAudioPlayer();

        // Initialize jQuery plugins
        if (typeof jQuery !== "undefined") {
          // Hero wrapper initialization
          if (typeof jQuery.fn.heroWrapper === "function") {
            jQuery(".hero-wrapper").heroWrapper();
          }

          // Other common plugins
          if (typeof jQuery.fn.equalHeights === "function") {
            jQuery(".equal-heights").equalHeights();
          }

          // Trigger WordPress hooks
          jQuery(document).trigger("barba:after");
          jQuery(document).trigger("ready");
        }

        // Update wp-admin bar positioning
        if (document.getElementById("wpadminbar")) {
          document.body.style.marginTop = "32px";
        }
      });
    });

    // Define leave/enter animations
    barba.hooks.leave((data) => {
      return gsap.to(data.current.container, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    });

    barba.hooks.enter((data) => {
      window.scrollTo(0, 0);
      return gsap.from(data.next.container, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    });
  }

  // Initialize when DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    initTransitions();

    // Initial setup of jQuery plugins
    ensureJQueryPlugins();
  });
})(window);
