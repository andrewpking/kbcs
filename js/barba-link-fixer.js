/**
 * Barba.js Link Fixer
 * This script directly intervenes in link handling to ensure Barba.js 
 * works correctly for single-page routing
 */

(function() {
    console.log("[BARBA FIXER] Link fixer initialized");
    
    // Always use the main jQuery instance for consistency
    var $ = window.jQuery;
    
    // Interval reference for link scanning
    let linkScanInterval = null;
    
    // Cache of fixed links to avoid duplicate processing
    const fixedLinks = new Set();
    
    /**
     * Main function to override all internal links
     */
    function fixAllLinks() {
        if (typeof barba === 'undefined') {
            console.warn("[BARBA FIXER] Barba.js not loaded yet, will retry");
            return false;
        }
        
        console.log("[BARBA FIXER] Fixing links for Barba routing", {
            origin: window.location.origin,
            pathname: window.location.pathname,
            href: window.location.href
        });
        let fixedCount = 0;
        
        // Use jQuery if available for better plugin compatibility
        if ($) {
            // Get internal links on the page using jQuery
            $('a[href^="/"], a[href^="' + window.location.origin + '"]').not('[data-barba-fixed], [data-no-barba], .no-barba').each(function() {
                const link = this;
            // Skip if already fixed
            if (fixedLinks.has(link)) return;
            
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Skip links we shouldn't handle
            if (shouldSkipLink(link, href)) return;
            
            // Mark as fixed
            link.setAttribute('data-barba-fixed', 'true');
            fixedLinks.add(link);
            fixedCount++;
            
            // Process URLs for Barba - convert to relative paths
            let processedHref = href;
            try {
                const url = new URL(href, window.location.origin);
                // Only process internal links
                if (url.origin === window.location.origin) {
                    // Strip the origin to make it relative
                    processedHref = url.pathname + url.search + url.hash;
                    console.log("[BARBA FIXER] Converted to relative URL:", {
                        from: href,
                        to: processedHref,
                        internal: true
                    });
                }
            } catch (e) {
                console.warn("[BARBA FIXER] URL processing error:", e);
                return; // Skip this link if URL is invalid
            }
            
            // Add data-barba attribute to internal links
            $(link).attr('data-barba', 'link');
            $(link).attr('data-processed-href', processedHref);
            
            // Override click behavior using jQuery for better plugin compatibility
            $(link).off('click').on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                    
                if (typeof barba === 'undefined' || !barba.ready) {
                    console.warn("[BARBA FIXER] Barba not ready, falling back to normal navigation");
                    window.location.href = href;
                    return false;
                }
                    
                const processedHref = $(this).attr('data-processed-href') || href;
                console.log("[BARBA FIXER] Navigating to:", processedHref);
                try {
                    barba.go(processedHref);
                } catch (err) {
                    console.error("[BARBA FIXER] Navigation failed:", err);
                    window.location.href = href;
                }
                return false;
            });
            });
        } else {
            // Fallback to standard DOM methods if jQuery isn't available
            const links = document.querySelectorAll('a[href^="/"], a[href^="' + window.location.origin + '"]');
            const internalLinks = Array.from(links).filter(link => !link.hasAttribute('data-barba-fixed') && !link.hasAttribute('data-no-barba') && !link.classList.contains('no-barba'));
            
            internalLinks.forEach(function(link) {
                // Skip if already fixed
                if (fixedLinks.has(link)) return;
                
                const href = link.getAttribute('href');
                if (!href) return;
                
                // Skip links we shouldn't handle
                if (shouldSkipLink(link, href)) return;
                
                // Mark as fixed
                link.setAttribute('data-barba-fixed', 'true');
                fixedLinks.add(link);
                fixedCount++;
                
                // Use the URL as-is without normalization
                // Add data-barba attribute to internal links
                link.setAttribute('data-barba', 'link');
    
                // Ensure the link has a proper ID for tracking
                if (!link.id) {
                    link.id = 'barba-link-' + Math.random().toString(36).substr(2, 9);
                }
                
                // Override click behavior
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (typeof barba === 'undefined' || !barba.ready) {
                        console.warn("[BARBA FIXER] Barba not ready, falling back to normal navigation");
                        window.location.href = href;
                        return false;
                    }
                    
                    console.log("[BARBA FIXER] Navigating to:", href);
                    try {
                        barba.go(href);
                    } catch (err) {
                        console.error("[BARBA FIXER] Navigation failed:", err);
                        window.location.href = href;
                    }
                    return false;
                }, true);
            });
        }
        
        console.log(`[BARBA FIXER] Fixed ${fixedCount} links`);
        return true;
    }
    
    /**
     * Determine if a link should be skipped (not handled by Barba)
     */
    function shouldSkipLink(link, href) {
        // Skip empty links
        if (!href) return true;

        try {
            // Handle both relative and absolute URLs
            const url = new URL(href, window.location.origin);
            
            // Skip if different domain
            if (url.origin !== window.location.origin) {
                console.log("[BARBA FIXER] Skipping external link:", href);
                return true;
            }

            // Skip WordPress admin, login, and special URLs
            if (url.pathname.includes('/wp-admin') ||
                url.pathname.includes('/wp-login') ||
                url.pathname.includes('/feed/') ||
                url.pathname.includes('/streamkbcs') ||
                url.pathname.includes('radiorethink.com') ||
                url.pathname.match(/\.(jpg|jpeg|png|gif|pdf|zip|doc|docx)$/i)) {
                console.log("[BARBA FIXER] Skipping WordPress special URL:", href);
                return true;
            }

            // Skip hash links on the same page
            if (url.hash && url.pathname === window.location.pathname) {
                console.log("[BARBA FIXER] Skipping same-page hash link:", href);
                return true;
            }

            console.log("[BARBA FIXER] Processing internal link:", {
                href: href,
                pathname: url.pathname,
                processed: true
            });
            
            return false;
        } catch (e) {
            console.warn("[BARBA FIXER] Invalid URL:", href);
            return true;
        }
        
        // Skip links with special attributes
        if (link.getAttribute('target') === '_blank' || 
            link.hasAttribute('download') ||
            link.classList.contains('no-barba') ||
            link.hasAttribute('data-no-barba')) {
            return true;
        }
        
        // Skip special paths
        if (href.startsWith('#') || 
            href.includes('wp-admin') || 
            href.includes('wp-login') ||
            href.includes('streamkbcs') ||
            href.includes('radiorethink.com')) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Set up mutation observer to detect new links added to the DOM
     */
    function setupLinkObserver() {
        // Use jQuery-compatible approach
        if ($) {
            // Set up a periodic check for new links
                    setInterval(function() {
                        const unfixedLinks = $('a[href^="/"], a[href^="' + window.location.origin + '"]').not('[data-barba-fixed], [data-no-barba], .no-barba');
                        if (unfixedLinks.length > 0) {
                            console.log("[BARBA FIXER] Found new links to fix:", unfixedLinks.length);
                    
                            // Make sure jQuery is available
                            if (window.jQuery) {
                                // Add data-barba attribute to all internal links
                                window.jQuery('a[href^="' + window.location.origin + '"], a[href^="/"]').each(function() {
                                    var $link = window.jQuery(this);
                                    // Add data-barba attribute but don't change the href
                                    if (!$link.attr('data-barba') && !$link.hasClass('no-barba') && 
                                        !$link.attr('href').includes('wp-admin') && 
                                        !$link.attr('href').includes('wp-login') &&
                                        !$link.attr('href').startsWith('#')) {
                                        $link.attr('data-barba', 'link');
                                        console.log("[BARBA FIXER] Added data-barba attribute to:", $link.attr('href'));
                                    }
                                });
                            }
                    
                            fixAllLinks();
                        }
                    }, 1000);
            
            // Also use MutationObserver as a backup
            if (window.MutationObserver) {
                setupMutationObserver();
            }
            
            console.log("[BARBA FIXER] jQuery link observer set up");
        } else {
            // Fallback to standard MutationObserver
            setupMutationObserver();
        }
    }
    
    /**
     * Set up standard MutationObserver for browsers without jQuery
     */
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            let needsFixing = false;
            
            mutations.forEach(function(mutation) {
                // Check if new nodes were added
                if (mutation.addedNodes.length) {
                    // Look for links in the added nodes
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            if (node.tagName === 'A') {
                                needsFixing = true;
                            } else if (node.querySelectorAll) {
                                const hasLinks = node.querySelectorAll('a').length > 0;
                                if (hasLinks) needsFixing = true;
                            }
                        }
                    });
                }
            });
            
            // If new links were added, fix them
            if (needsFixing) {
                fixAllLinks();
            }
        });
        
        // Start observing the entire document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log("[BARBA FIXER] Mutation observer set up");
    }
    
    /**
     * Handle the direct click event at the document level
     * This is a fallback in case our link fixing misses something
     */
    function setupGlobalClickHandler() {
        if ($) {
            // Use jQuery for the click handler
            $(document).on('click', 'a[href^="/"], a[href^="' + window.location.origin + '"]', function(e) {
                // Skip if already fixed or excluded
                if ($(this).is('[data-barba-fixed], [data-no-barba], .no-barba, [target="_blank"], [href^="#"], [href*="wp-admin"], [href*="wp-login"]')) {
                    return;
                }
                const link = this;
                
                // Get href
                const href = link.getAttribute('href');
                if (!href) return;
                
                // Skip links we shouldn't handle
                if (shouldSkipLink(link, href)) return;
                
                // Stop the normal navigation
                e.preventDefault();
                e.stopPropagation();
                
                // Use URL as-is without normalization
                console.log("[BARBA FIXER] jQuery global handler caught link click:", href);
                
                // Use Barba's programmatic navigation
                if (typeof barba !== 'undefined' && barba.ready) {
                    try {
                        barba.go(href);
                    } catch (err) {
                        console.error("[BARBA FIXER] Navigation failed:", err);
                        window.location.href = href;
                    }
                } else {
                    console.warn("[BARBA FIXER] Barba not ready, falling back to normal navigation");
                    window.location.href = href;
                }
                
                return false;
            });
            
            console.log("[BARBA FIXER] jQuery global click handler installed");
        } else {
            // Fallback to standard DOM events
            document.addEventListener('click', function(e) {
                // Find if we clicked on a link or a child of a link
                let link = null;
                if (e.target.tagName === 'A') {
                    link = e.target;
                } else if (e.target.closest('a')) {
                    link = e.target.closest('a');
                }
                
                if (!link) return; // Not a link
                
                // Skip already fixed links
                if (link.hasAttribute('data-barba-fixed')) return;
                
                // Get href
                const href = link.getAttribute('href');
                if (!href) return;
                
                // Skip links we shouldn't handle
                if (shouldSkipLink(link, href)) return;
                
                // Stop the normal navigation
                e.preventDefault();
                e.stopPropagation();
                
                // Use URL as-is without normalization
                console.log("[BARBA FIXER] Global handler caught link click:", href);
                
                // Use Barba's programmatic navigation
                if (typeof barba !== 'undefined') {
                    barba.go(href);
                } else {
                    console.error("[BARBA FIXER] Barba not available for navigation");
                    // Fallback to normal navigation if Barba isn't loaded
                    window.location.href = href;
                }
                
                return false;
            }, true); // Use capture phase to get the event before other handlers
            
            console.log("[BARBA FIXER] Standard global click handler installed");
        }
    }
    
    /**
     * Initialize the link fixer
     */
    function init() {
        console.log("[BARBA FIXER] Initializing");
        
        // Log jQuery status
        console.log("[BARBA FIXER] jQuery available:", !!$, "version:", $ ? $.fn.jquery : "N/A");
        console.log("[BARBA FIXER] Using:", $ === window.jQuery ? "WordPress jQuery" : "Barba jQuery noConflict");
        console.log("[BARBA FIXER] Site origin:", window.location.origin);
        
        // Try to fix links immediately
        const success = fixAllLinks();
        
        // Set up link observer for dynamic content
        setupLinkObserver();
        
        // Set up global click handler as fallback
        setupGlobalClickHandler();
        
        // If Barba isn't loaded yet, set up an interval to keep checking
        if (!success) {
            linkScanInterval = setInterval(function() {
                if (typeof barba !== 'undefined') {
                    console.log("[BARBA FIXER] Barba now available");
                    fixAllLinks();
                    clearInterval(linkScanInterval);
                }
            }, 500);
        }
        
        // Expose public methods
        window.barbaLinkFixer = {
            fixAllLinks: fixAllLinks,
            getFixedCount: function() {
                return fixedLinks.size;
            },
            debug: function() {
                return {
                    barbaAvailable: typeof barba !== 'undefined',
                    fixedLinks: fixedLinks.size,
                    allLinks: $ ? $('a').length : document.querySelectorAll('a').length,
                    jQuery: {
                        available: !!$,
                        version: $ ? $.fn.jquery : "N/A",
                        isWpJQuery: $ === window.jQuery
                    }
                };
            }
        };
    }
    
    // Initialize when DOM is ready and ensure Barba is loaded
    if ($) {
        $(function() {
            // Wait for Barba to be fully initialized
            const checkBarba = setInterval(function() {
                if (typeof barba !== 'undefined' && barba.ready) {
                    clearInterval(checkBarba);
                    init();
                }
            }, 100);
            
            // Set a timeout to prevent infinite waiting
            setTimeout(function() {
                clearInterval(checkBarba);
                console.warn("[BARBA FIXER] Timeout waiting for Barba, initializing anyway");
                init();
            }, 5000);
        });
    } else if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also initialize after Barba transitions
    if (typeof barba !== 'undefined') {
        barba.hooks.after(fixAllLinks);
        // Add more hooks for better coverage
        barba.hooks.afterEnter(fixAllLinks);
    } else {
        // Check periodically for Barba and set up hook when available
        const barbaCheckInterval = setInterval(function() {
            if (typeof barba !== 'undefined') {
                barba.hooks.after(fixAllLinks);
                barba.hooks.afterEnter(fixAllLinks);
                clearInterval(barbaCheckInterval);
            }
        }, 500);
    }
    
    // Add utilities for debugging
    window.barbaLinkFixerLoaded = true;
    window.barbaLinkFixer.debug = {
        getProcessedLinks: function() {
            return Array.from(fixedLinks).map(link => ({
                original: link.getAttribute('href'),
                processed: link.getAttribute('data-processed-href'),
                isBarbaLink: link.hasAttribute('data-barba')
            }));
        },
        getStats: function() {
            return {
                totalLinks: document.getElementsByTagName('a').length,
                fixedLinks: fixedLinks.size,
                barbaLinks: document.querySelectorAll('[data-barba="link"]').length,
                skippedLinks: document.querySelectorAll('.no-barba, [data-no-barba]').length
            };
        }
    };
    
    // Run once initially to fix all links - use window.jQuery directly for safety
    if (window.jQuery) {
        window.jQuery(document).ready(function() {
            // Add data-barba attribute to all internal links
            window.jQuery('a[href^="' + window.location.origin + '"], a[href^="/"]').each(function() {
                var $link = window.jQuery(this);
                // Add data-barba attribute but don't change the href
                if (!$link.attr('data-barba') && !$link.hasClass('no-barba') && 
                    !$link.attr('href').includes('wp-admin') && 
                    !$link.attr('href').includes('wp-login') &&
                    !$link.attr('href').startsWith('#')) {
                    $link.attr('data-barba', 'link');
                }
            });
            
            console.log("[BARBA FIXER] Added data-barba attributes on document ready");
        });
    }
    
    // Add event listener for Barba transitions
    document.addEventListener('barba-after-transition', function() {
        console.log("[BARBA FIXER] Running after Barba transition");
        if (window.jQuery) {
            // Fix all links again after transition
            fixAllLinks();
        }
    });
})();