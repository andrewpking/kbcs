/**
 * KBCS Homepage Hero
 * Handles the now playing data in the hero section
 * Compatible with Barba.js page transitions
 */

(function () {
  // Store timer reference
  let updateTimer = null;

  // Function to initialize and update hero content
  function initializeHero() {
    // Only proceed if hero block exists
    const heroBlock = document.getElementById("hero-block");
    if (!heroBlock) return;

    // Clear any existing timer
    if (updateTimer) {
      clearTimeout(updateTimer);
      updateTimer = null;
    }

    // Function to handle loading states
    function setLoading(isLoading) {
      const heroBlock = document.getElementById("hero-block");
      const pastFuture = document.getElementById("hero-past-future");

      if (isLoading) {
        if (heroBlock) heroBlock.classList.add("loading");
        if (pastFuture) pastFuture.classList.add("loading");
      } else {
        if (heroBlock) {
          heroBlock.classList.remove("loading");
          // Also remove any lingering loading divs
          heroBlock.querySelectorAll(".loading").forEach((el) => el.remove());
        }
        if (pastFuture) pastFuture.classList.remove("loading");
      }
    }

    // Function to update the hero content
    function updateHeroContent(data) {
      if (!data) {
        setLoading(false);
      }

      try {
        // Update current show
        jQuery("h2#hero-title").html(data.current.title);
        jQuery("#hero-host").html(data.current.host);
        jQuery("#hero-airtimes").html(data.current.airtimes);
        jQuery("#hero-link").attr("href", data.current.permalink);

        // Update image if available
        if (data.current.image_url) {
          // Force image reload by adding timestamp
          const timestamp = new Date().getTime();
          jQuery("#hero-image img")
            .attr("src", `${data.current.image_url}?t=${timestamp}`)
            .attr("alt", data.current.image_alt || "");
        }

        // Handle hosts list
        if (data.current.hosts && data.current.hosts.length > 0) {
          const hostContainer = jQuery("#hero-host");
          hostContainer.empty().append("Hosted by ");

          data.current.hosts.forEach((host, index) => {
            const hostLink = jQuery("<a>")
              .attr("href", host.link)
              .text(host.name);
            hostContainer.append(hostLink);

            if (index < data.current.hosts.length - 1) {
              hostContainer.append(", ");
            }
          });
        }

        // Update past and future shows
        jQuery("#hero-past-title").html(data.previous.title);
        jQuery("#hero-past-time").html(data.previous.airtimes);
        jQuery("#hero-past-link").attr("href", data.previous.permalink);

        jQuery("#hero-future-title").html(data.next.title);
        jQuery("#hero-future-time").html(data.next.airtimes);
        jQuery("#hero-future-link").attr("href", data.next.permalink);

        // Schedule next update
        const reload = data.current.end * 1000 - Date.now() + 5000;
        if (reload > 0) {
          console.log(
            `Next hero update in ${Math.round(reload / 1000 / 60)} minutes`,
          );
          updateTimer = setTimeout(getNowPlaying, reload);
        }
      } catch (error) {
        console.error("Error updating hero content:", error);
      } finally {
        // Always remove loading state
        setLoading(false);
      }
    }

    // Function to fetch now playing data
    function getNowPlaying() {
      setLoading(true);

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      jQuery
        .getJSON(`/wp-json/kbcsapi/v1/now-playing/${hours}${minutes}`)
        .done(updateHeroContent)
        .fail((error) => {
          console.warn("Error fetching now playing data:", error);
          setLoading(false);
          // Retry after 1 minute on error
          updateTimer = setTimeout(getNowPlaying, 60000);
        });
    }

    // Start the update cycle with a small delay to ensure DOM is ready
    setTimeout(() => {
      console.log("[Hero] Starting update cycle...");
      getNowPlaying();
    }, 100);
  }

  // Initialize on regular page load
  jQuery(document).ready(initializeHero);

  // Initialize on Barba transitions
  document.addEventListener("barba:after", initializeHero);
  document.addEventListener("barbaAfterEnter", initializeHero);

  // Cleanup when leaving page
  document.addEventListener("barba:before", () => {
    const heroBlock = document.getElementById("hero-block");
    if (heroBlock) {
      heroBlock.classList.remove("loading");
      heroBlock.querySelectorAll(".loading").forEach((el) => el.remove());
    }

    if (updateTimer) {
      clearTimeout(updateTimer);
      updateTimer = null;
    }
  });

  // Export for external use
  window.initializeHero = initializeHero;
})();
