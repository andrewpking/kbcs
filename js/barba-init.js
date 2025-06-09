/**
 * KBCS Barba.js Implementation
 * Handles smooth page transitions while maintaining audio player state
 * Based on recommended WordPress implementation
 */

// Store original jQuery instance
let originalJQuery = null;
if (typeof jQuery !== "undefined") {
  originalJQuery = jQuery;
}

// Helper function to reinitialize jQuery
function reinitializeJQuery() {
  if (typeof jQuery !== "undefined") {
    // Store current jQuery state
    const oldJQuery = jQuery;
    const oldReadyCallbacks = jQuery.readyList;

    // Reset jQuery to original state
    window.jQuery = originalJQuery;
    window.$ = originalJQuery;

    // Trigger unload to clean up plugins
    jQuery(window).trigger("unload");

    // Reset ready state
    jQuery.ready = true;
    jQuery.readyList = [];

    // Simulate DOM ready event
    jQuery(document).trigger("ready");

    // Re-run any ready callbacks
    if (oldReadyCallbacks && oldReadyCallbacks.length) {
      oldReadyCallbacks.forEach((callback) => {
        jQuery(callback);
      });
    }
  }
}

// Helper function to init/update WordPress native features
function initWordPressFeatures() {
  // Run WordPress functions if they exist
  if (typeof window.addComment === "object") {
    window.addComment.init();
  }

  // Handle admin bar positioning
  if (document.getElementById("wpadminbar")) {
    document.body.style.marginTop = "32px";
  }

  // Reinit WordPress embeds if the function exists
  if (typeof window.wp !== "undefined" && window.wp.embedPages) {
    window.wp.embedPages.reload();
  }
}

// Initialize script tracking
let runningScripts = [];
let pageSpecificScripts = new Set();

// Track initial scripts when DOM is loaded
function trackInitialScripts() {
  const scriptTags = document.getElementsByTagName("script");
  Array.from(scriptTags).forEach((script) => {
    const src = script.getAttribute("src");
    if (src) {
      // Check if it's a page-specific script
      if (
        src.includes("/page-scripts/") ||
        script.hasAttribute("data-page-specific")
      ) {
        pageSpecificScripts.add(src);
      } else {
        runningScripts.push(src);
      }
    }
  });
}

// Function to load new scripts for a page
function loadNewScripts(container) {
  return new Promise((resolve) => {
    const newImports = [];
    let newEvaluations = "";

    // Find all scripts in the new container
    const scriptTags = container.getElementsByTagName("script");

    Array.from(scriptTags).forEach((script) => {
      const src = script.getAttribute("src");
      if (src) {
        // Always reload page-specific scripts
        if (
          src.includes("/page-scripts/") ||
          script.hasAttribute("data-page-specific")
        ) {
          newImports.push(src);
        }
        // Load other scripts only if not already loaded
        else if (!runningScripts.includes(src)) {
          newImports.push(src);
          runningScripts.push(src);
        }
      } else if (script.innerHTML.trim()) {
        // Include inline scripts that are page-specific or need reloading
        if (
          script.hasAttribute("data-page-specific") ||
          script.hasAttribute("data-reload-on-page-change") ||
          script.innerHTML.includes("var ") ||
          script.innerHTML.includes("let ") ||
          script.innerHTML.includes("const ")
        ) {
          newEvaluations += script.innerHTML + "\n";
        }
      }
    });

    // Load scripts sequentially
    const loadScriptSequentially = (scripts, index = 0) => {
      if (index >= scripts.length) {
        // All scripts loaded, evaluate inline scripts
        if (newEvaluations) {
          try {
            eval(newEvaluations);
          } catch (error) {
            console.warn("Error evaluating inline scripts:", error);
          }
        }
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = scripts[index];

      // Mark page-specific scripts
      if (
        scripts[index].includes("/page-scripts/") ||
        scripts[index].includes("data-page-specific")
      ) {
        script.setAttribute("data-page-specific", "true");
      }

      script.onload = () => loadScriptSequentially(scripts, index + 1);
      script.onerror = () => {
        console.warn(`Failed to load script: ${scripts[index]}`);
        loadScriptSequentially(scripts, index + 1);
      };
      document.body.appendChild(script);
    };

    if (newImports.length > 0) {
      loadScriptSequentially(newImports);
    } else if (newEvaluations) {
      try {
        eval(newEvaluations);
      } catch (error) {
        console.warn("Error evaluating inline scripts:", error);
      }
      resolve();
    } else {
      resolve();
    }
  });
}

// Initialize Barba
barba.init({
  // Define views
  views: [
    {
      namespace: "*",
      beforeEnter() {
        // Reset scroll position
        window.scrollTo(0, 0);

        // Clean up old page-specific scripts
        document
          .querySelectorAll("script[data-page-specific]")
          .forEach((script) => {
            script.remove();
          });

        // Clear any existing timers
        const existingTimers = window.setTimeout(() => {}, 0);
        for (let i = 0; i <= existingTimers; i++) {
          clearTimeout(i);
        }
      },
      afterEnter({ next }) {
        console.log("[Barba] After enter started");
        return new Promise((resolve) => {
          // Load new scripts from the next page
          loadNewScripts(next.container).then(() => {
            // Update WordPress features
            initWordPressFeatures();

            // Reinitialize jQuery plugins if available
            if (window.jQuery) {
              // Reset jQuery's ready state
              jQuery.ready.promise().then = function (fn) {
                fn();
                console.log("[Barba] Reset JQuery state");
              };

              // Trigger ready events in sequence
              jQuery(document).trigger("ready");

              // Initialize specific plugins
              if (jQuery.fn.heroWrapper) {
                jQuery(".hero-wrapper").heroWrapper();
              }
              if (jQuery.fn.equalHeights) {
                jQuery(".equal-heights").equalHeights();
              }

              // Trigger Barba-specific jQuery events
              jQuery(document).trigger("barba:after");
              jQuery(document).trigger("barba:ready");
            }

            // Wait a moment for DOM updates to complete
            setTimeout(() => {
              // Initialize hero if present
              if (
                typeof initializeHero === "function" &&
                document.getElementById("hero-block")
              ) {
                console.log("[Barba] Initializing Hero after page change");
                initializeHero();
              }

              // Trigger custom events
              document.dispatchEvent(new Event("barba:after"));
              document.dispatchEvent(new Event("barbaAfterEnter"));

              resolve();
            }, 100);
          });
        });
      },
    },
  ],

  // Prevent Barba from handling certain URLs
  prevent: ({ el }) => {
    // If there's no element to check, prevent Barba
    if (!el) return true;

    const href = el.href || "";

    // Don't handle these URLs with Barba
    return (
      href.includes("/wp-admin") ||
      href.includes("/feed") ||
      href.includes("/wp-login") ||
      href.includes("wp-content") ||
      el.classList.contains("no-barba") ||
      el.hasAttribute("data-barba-prevent") ||
      el.getAttribute("target") === "_blank" ||
      href.includes("?") || // Prevent AJAX on query parameters
      el.classList.contains("ab-item") // WordPress admin bar items
    );
  },

  // Define transitions
  transitions: [
    {
      name: "default-transition",

      // Before leaving current page
      leave(data) {
        const done = this.async();

        // Animate out the content
        gsap.to(data.current.container, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => done(),
        });
      },

      // Before entering new page
      beforeEnter(data) {
        // Reset scroll position
        window.scrollTo(0, 0);

        // Convert all links to relative paths
        convertLinksToRelative();
      },

      // Enter new page
      enter(data) {
        const done = this.async();

        // Animate in the new content
        gsap.fromTo(
          data.next.container,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            onComplete: () => {
              window.scrollTo(0, 0);
              done();
            },
          },
        );
      },
    },
  ],
});

// Function to convert absolute URLs to relative
function convertLinksToRelative() {
  document
    .querySelectorAll("a[href]:not([data-barba-prevent])")
    .forEach((link) => {
      // Skip links that should not be handled by Barba
      if (
        link.getAttribute("data-barba-prevent") === "all" ||
        link.classList.contains("no-barba") ||
        link.classList.contains("ab-item") ||
        link.href.includes("/wp-admin") ||
        link.href.includes("/feed") ||
        link.href.includes("/wp-login") ||
        link.href.includes("wp-content") ||
        link.getAttribute("target") === "_blank"
      ) {
        return;
      }

      // Convert absolute URLs to relative if they're from our domain
      if (link.href.startsWith(window.location.origin)) {
        const url = new URL(link.href);
        link.href = url.pathname + url.search + url.hash;
      }
    });
}

// Barba hooks
barba.hooks.beforeOnce(() => {
  // Hide JavaScript warning since Barba is running
  const jsWarning = document.getElementById("enable_javascript");
  if (jsWarning) {
    jsWarning.style.display = "none";
  }
});

barba.hooks.after((data) => {
  // Update page title
  const titleElement = document.querySelector("title");
  const newTitleElement = data.next.html.match(/<title>(.*?)<\/title>/i);

  if (newTitleElement && newTitleElement[1]) {
    titleElement.textContent = newTitleElement[1];
  }

  // Update WordPress nonce if available
  if (typeof barbaSettings !== "undefined") {
    fetch(
      `${barbaSettings.ajaxUrl}?action=barba_content&_ajax_nonce=${barbaSettings.nonce}`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text().then((text) => {
          try {
            return JSON.parse(text);
          } catch (e) {
            console.warn("Invalid JSON response for nonce update:", text);
            return null;
          }
        });
      })
      .then((data) => {
        if (data && data.nonce) {
          barbaSettings.nonce = data.nonce;
        }
      })
      .catch((error) => {
        console.warn("Error updating WordPress nonce:", error);
      });
  }
});

// Initial setup
document.addEventListener("DOMContentLoaded", () => {
  trackInitialScripts();
  convertLinksToRelative();
  initWordPressFeatures();

  // On first load, wait for everything to be ready
  setTimeout(() => {
    // Initialize hero if present
    if (
      typeof initializeHero === "function" &&
      document.getElementById("hero-block")
    ) {
      console.log("[Barba] Initializing hero on first load");
      initializeHero();
    }
  }, 100);
});
