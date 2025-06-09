/**
 * Barba.js WordPress integration helper
 * This file handles the specific WordPress integrations needed for Barba.js
 * to work correctly with WordPress themes and plugins.
 */

(function() {
    console.log("[BARBA WP] WordPress integration helper initialized");
    
    // Always use the main jQuery instance for consistency
    var $ = window.jQuery;
    console.log("[BARBA WP] Using jQuery version:", $ ? $.fn.jquery : "not available");
    console.log("[BARBA WP] Site origin:", window.location.origin);
    
    // Ensure $barba always points to jQuery
    window.$barba = window.jQuery;

    // Override WordPress link handling to ensure Barba takes precedence
    if (typeof jQuery !== 'undefined') {
        jQuery(document).ready(function($wp) {
            // Use our preferred jQuery instance
            var $barbaJQ = window.$barba || $wp;
            
            // Disable WordPress AJAX navigation if present
            if (typeof wp !== 'undefined' && wp.ajax) {
                console.log("[BARBA WP] Disabling WordPress AJAX navigation");
                // Only disable click handlers for normal internal links
                $wp(document).off('click', 'a:not(.no-barba):not([data-no-barba]):not([target="_blank"]):not([href^="#"]):not([href*="wp-admin"]):not([href*="wp-login"])');
            }
        });
    }

    /**
     * Handles WordPress specific functionality after Barba page transitions
     */
    function handleWordPressIntegration() {
        console.log("[BARBA WP] Running WordPress integration handler");
        
        // Get the correct jQuery instances
        var $wp = window.jQuery;
        var $barbaJQ = window.$barba || $wp;
        
        // Re-initialize WordPress embeds if present
        if (window.wp && window.wp.embed) {
            try {
                window.wp.embed.run();
                console.log("[BARBA WP] Re-initialized WordPress embeds");
            } catch (e) {
                console.error('[BARBA WP] Error reinitializing WP embeds:', e);
            }
        }

        // Handle WP forms if Gravity Forms is present
        if ($wp && $wp.fn.gformInitSpinner) {
            console.log("[BARBA WP] Re-initializing Gravity Forms");
            $wp(document).trigger('gform_post_render');
        }

        // Re-initialize WordPress media elements (like audio/video)
        if (window.wp && window.wp.mediaelement) {
            try {
                window.wp.mediaelement.initialize();
                console.log("[BARBA WP] Re-initialized WordPress media elements");
            } catch (e) {
                console.error('[BARBA WP] Error reinitializing WP media elements:', e);
            }
        }

        // Handle WordPress comments form
        if (document.getElementById('commentform')) {
            const commentForm = document.getElementById('commentform');
            commentForm.removeAttribute('data-barba-processed');
        }

        // Re-initialize WordPress admin bar if present
        if (document.getElementById('wpadminbar')) {
            const adminBarLinks = document.querySelectorAll('#wpadminbar a');
            adminBarLinks.forEach(link => {
                link.classList.add('no-barba');
            });
        }

        // Trigger WordPress custom events to signal content has updated
        if ($wp) {
            $wp(document).trigger('wp-page-updated');
            $wp(document).trigger('post-load'); // Used by Infinite Scroll and other WP features
            console.log("[BARBA WP] Triggered WordPress update events");
            
            // If we have a separate jQuery instance for Barba, trigger there too
            if ($barbaJQ !== $wp) {
                $barbaJQ(document).trigger('wp-page-updated');
                $barbaJQ(document).trigger('post-load');
            }
        }

        // Handle WordPress search form
        const searchForms = document.querySelectorAll('form[role="search"]');
        searchForms.forEach(form => {
            if (!form.getAttribute('data-barba-processed')) {
                form.setAttribute('data-barba-processed', 'true');
            }
        });

        // Fix for WordPress galleries and sliders
        if ($wp && $wp.fn.flexslider) {
            console.log("[BARBA WP] Re-initializing FlexSlider");
            $wp('.flexslider').flexslider();
        }

        // Fix for WordPress lightboxes
        if ($wp && $wp.fn.magnificPopup) {
            console.log("[BARBA WP] Re-initializing Magnific Popup");
            $wp('.gallery').magnificPopup({
                delegate: 'a',
                type: 'image',
                gallery: { enabled: true }
            });
        }

        // Process shortcodes in the new content if a shortcode processor exists
        if (window.kbcsProcessShortcodes) {
            window.kbcsProcessShortcodes();
        }
    }

    // Add our WordPress handler to Barba hooks
    if (window.barba) {
        console.log("[BARBA WP] Barba found, adding hooks");
        window.barba.hooks.after(handleWordPressIntegration);
        
        // Also add to before hook to prepare WordPress
        window.barba.hooks.before(function() {
            console.log("[BARBA WP] Preparing WordPress for transition");
            // Remove only specific click handlers that might interfere
            if (typeof jQuery !== 'undefined') {
                var $wp = jQuery;
                // Only remove handlers for normal internal links
                $wp(document).off('click', 'a:not(.no-barba):not([data-no-barba]):not([target="_blank"]):not([href^="#"]):not([href*="wp-admin"]):not([href*="wp-login"])');
            }
        });
        
        // Add enter hook to re-initialize any WordPress plugins
        window.barba.hooks.enter(function() {
            console.log("[BARBA WP] Enter hook - preparing to reinitialize WordPress");
        });
    } else {
        // If Barba isn't loaded yet, wait for it
        console.warn("[BARBA WP] Barba not found, waiting for DOMContentLoaded");
        document.addEventListener('DOMContentLoaded', function() {
            if (window.barba) {
                console.log("[BARBA WP] Barba found after DOM ready, adding hooks");
                window.barba.hooks.after(handleWordPressIntegration);
                
                window.barba.hooks.before(function() {
                    // Remove only specific click handlers
                    if (typeof jQuery !== 'undefined') {
                        var $wp = jQuery;
                        $wp(document).off('click', 'a:not(.no-barba):not([data-no-barba]):not([target="_blank"]):not([href^="#"]):not([href*="wp-admin"]):not([href*="wp-login"])');
                    }
                });
            } else {
                console.error("[BARBA WP] Barba still not available after DOM ready");
            }
        });
    }

    /**
     * Fix WordPress AJAX URL for Barba.js transitions
     * This ensures WordPress AJAX requests continue to work after page transitions
     */
    if (typeof window.ajaxurl === 'undefined' && window.kbcsAjaxUrl) {
        window.ajaxurl = window.kbcsAjaxUrl;
        console.log("[BARBA WP] Set WordPress AJAX URL:", window.ajaxurl);
    }

    // Fix all links to ensure they work with Barba
    function fixWordPressLinks() {
        console.log("[BARBA WP] Fixing WordPress links for Barba");
    
        if (!window.barba) {
            console.error("[BARBA WP] Cannot fix links - Barba not available");
            return;
        }
        
        // Use the appropriate jQuery instance
        var $wp = window.jQuery;
        var $barbaJQ = window.$barba || $wp;
    
        // Process all links on the page using jQuery for better compatibility
    $barbaJQ('a').each(function() {
        var link = this;
            
        // Skip if already processed
        if (link.hasAttribute('data-barba-fixed')) return;
        
        const href = link.getAttribute('href');
        if (!href) return;
            
        // Don't normalize URLs, just add data-barba attribute
        if (!link.hasAttribute('data-barba')) {
            link.setAttribute('data-barba', 'link');
        }
        
        // Check if it's an internal link
        const isInternal = href.startsWith('/') || 
                          href.startsWith(window.location.origin) ||
                          !href.includes('://');
                          
        // Skip external links and special links
        if (!isInternal || 
            link.getAttribute('target') === '_blank' || 
            link.hasAttribute('download') ||
            href.startsWith('#') ||
            href.includes('wp-admin') ||
            href.includes('wp-login') ||
            link.classList.contains('no-barba') ||
            link.hasAttribute('data-no-barba')) {
            return;
        }
        
        // Mark as fixed to avoid processing again
        link.setAttribute('data-barba-fixed', 'true');
            
        // Use jQuery to safely unbind events
        $barbaJQ(link).off('click');
        
        // Add our Barba handler
        $barbaJQ(link).on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("[BARBA WP] Handling link click via Barba:", href);
            window.barba.go(href);
            return false;
        });
    });
    }

    // Run link fixing on page load and after transitions
    document.addEventListener('DOMContentLoaded', function() {
        // Delay slightly to ensure WordPress is fully initialized
        setTimeout(fixWordPressLinks, 100);
    });
    
    // Also run when jQuery is ready
    if (typeof jQuery !== 'undefined') {
        jQuery(document).ready(function() {
            setTimeout(fixWordPressLinks, 100);
        });
    }
    
    if (window.barba) {
        window.barba.hooks.after(fixWordPressLinks);
        // Also fix links when DOM changes
        window.barba.hooks.afterEnter(fixWordPressLinks);
        
        // Add custom event handler
        document.addEventListener('barba-after-transition', function() {
            console.log("[BARBA WP] Running fixWordPressLinks after transition event");
            setTimeout(fixWordPressLinks, 100);
        });
        
        // Add a hook to ensure internal links have data-barba attribute
        window.barba.hooks.before(function() {
            if ($barbaJQ) {
                // Add data-barba to internal links
                // Make sure jQuery is available
                if (typeof jQuery !== 'undefined') {
                    // Add data-barba attribute to internal links
                    jQuery('a[href^="' + window.location.origin + '"]:not([data-barba])').each(function() {
                        var $link = jQuery(this);
                        $link.attr('data-barba', 'link');
                        console.log("[BARBA WP] Added data-barba attribute to internal link");
                    });
                }
            }
        });
    }

    /**
     * Add global variable to allow themes/plugins to detect Barba.js
     */
    window.kbcsBarbaEnabled = true;
    console.log("[BARBA WP] Set kbcsBarbaEnabled flag");

    // Add debugging function
    window.debugWordPressBarba = function() {
        console.log("==== WORDPRESS BARBA DEBUG ====");
        console.log("WordPress Barba integration active:", window.kbcsBarbaEnabled);
        console.log("WordPress AJAX URL:", window.ajaxurl);
        console.log("Barba available:", typeof window.barba !== 'undefined');
        console.log("jQuery available:", typeof jQuery !== 'undefined', "version:", jQuery ? jQuery.fn.jquery : "N/A");
        console.log("$barba available:", typeof window.$barba !== 'undefined', "version:", window.$barba ? window.$barba.fn.jquery : "N/A");
        console.log("WP object available:", typeof wp !== 'undefined');
    
        // Use jQuery for better compatibility
        var $barbaJQ = window.$barba || window.jQuery;
        
        // Count internal/external links
        let internalLinks = 0;
        let externalLinks = 0;
        let specialLinks = 0;
        let fixedLinks = 0;
    
        $barbaJQ('a').each(function() {
            const link = this;
            const href = link.getAttribute('href');
            if (!href) return;
            
            if (link.hasAttribute('data-barba-fixed')) {
                fixedLinks++;
            }
        
            if (href.startsWith('#') || href.includes('wp-admin') || href.includes('wp-login')) {
                specialLinks++;
            } else if (href.startsWith('http') && !href.includes(window.location.hostname)) {
                externalLinks++;
            } else {
                internalLinks++;
            }
        });
    
        console.log("Link counts - Internal:", internalLinks, "External:", externalLinks, "Special:", specialLinks);
        console.log("Barba-fixed links:", fixedLinks);
        console.log("============================");
    
        return {
            barbaEnabled: window.kbcsBarbaEnabled,
            ajaxUrl: window.ajaxurl,
            // Barba available: typeof window.barba !== 'undefined',
            jQueryInfo: {
                available: typeof jQuery !== 'undefined',
                version: jQuery ? jQuery.fn.jquery : "N/A"
            },
            jQueryPlugins: jQuery ? Object.keys(jQuery.fn).filter(key => typeof jQuery.fn[key] === 'function') : [],
            wpAvailable: typeof wp !== 'undefined',
            linkCounts: {
                internal: internalLinks,
                external: externalLinks,
                special: specialLinks,
                fixed: fixedLinks
            },
            // Add a method to force-fix links
            fixLinks: function() {
                fixWordPressLinks();
                return "Links fixed";
            }
        };
    };

    /**
     * Handle browser history and analytics tracking
     */
    if (window.barba) {
        // Use our jQuery instance for better event handling
        var $barbaJQ = window.$barba || window.jQuery;
        
        // Add a very early hook to capture link clicks manually
        if ($barbaJQ) {
            $barbaJQ(document).on('click', 'a:not(.no-barba):not([data-no-barba]):not([data-barba-fixed]):not([data-barba-prevent]):not([target="_blank"]):not([href^="#"]):not([href*="wp-admin"]):not([href*="wp-login"]):not([download])', function(e) {
                const link = this;
                const href = link.getAttribute('href');
                
                if (!href) return;
                
                // Only handle internal links
                if (href.startsWith('http') && !href.includes(window.location.hostname)) {
                    return; // External link
                }
                
                // For internal links, handle with Barba
                console.log("[BARBA WP] jQuery capturing internal link click:", href);
                e.preventDefault();
                e.stopPropagation();
                window.barba.go(href);
                return false;
            });
        } else {
            // Fallback to standard DOM event if jQuery isn't available
            document.addEventListener('click', function(e) {
                // Find if we clicked on a link or a child of a link
                let link = null;
                if (e.target.tagName === 'A') {
                    link = e.target;
                } else if (e.target.closest('a')) {
                    link = e.target.closest('a');
                }
            
                if (!link) return; // Not a link
            
                // Get href
                const href = link.getAttribute('href');
                if (!href) return;
            
                // Only handle internal links
                if (href.startsWith('http') && !href.includes(window.location.hostname)) {
                    return; // External link
                }
            
                // Skip special links
                if (href.startsWith('#') || 
                    href.includes('wp-admin') || 
                    href.includes('wp-login') ||
                    link.hasAttribute('download') ||
                    link.getAttribute('target') === '_blank' ||
                    link.classList.contains('no-barba') ||
                    link.hasAttribute('data-no-barba')) {
                    return;
                }
            
                // If we've fixed this link or it has data-barba-prevent, don't interfere
                if (link.hasAttribute('data-barba-fixed') || 
                    link.hasAttribute('data-barba-prevent')) {
                    return;
                }
            
                // For all other internal links, handle with Barba
                console.log("[BARBA WP] Capturing internal link click:", href);
                e.preventDefault();
                e.stopPropagation();
                window.barba.go(href);
                return false;
            }, true); // Use capture phase to run before other handlers
        }
    
        window.barba.hooks.after(() => {
            console.log("[BARBA WP] After hook - updating analytics");
            // Track pageview in Google Analytics if available
            if (typeof ga === 'function') {
                ga('set', 'page', window.location.pathname + window.location.search);
                ga('send', 'pageview');
                console.log("[BARBA WP] Google Analytics pageview sent");
            }

            // Track pageview in Google Tag Manager if available
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'pageview',
                    'page': {
                        'path': window.location.pathname + window.location.search,
                        'title': document.title
                    }
                });
                console.log("[BARBA WP] Google Tag Manager pageview pushed");
            }
            
            // Also notify WordPress plugins that might need to know about the page change
            if (typeof jQuery !== 'undefined') {
                jQuery(window).trigger('hashchange');
                jQuery(window).trigger('barba-page-loaded');
            }
        });
        
        // Ensure we detect when Barba is done with all transitions
        window.barba.hooks.afterEnter(() => {
            console.log("[BARBA WP] afterEnter - finalizing transition");
            
            // Re-initialize any WordPress plugins that might have been loaded via AJAX
            setTimeout(handleWordPressIntegration, 100);
        });
    }
    
    // Set a flag indicating we've loaded the enhanced WordPress integration
    window.kbcsBarbaWPEnhanced = true;

})();