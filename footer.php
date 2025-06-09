        </main><!-- End of main content area -->
		</div><!-- End of Barba container -->
		</div><!-- wrapper container -->

		<footer class="container" id="foot">
			<nav aria-label="Connect with KBCS">

				<div class="span3 vcard">
                         <h4><a class="url fn n org" href="<?php echo home_url(); ?>/">KBCS Radio</a></h4>
                         
                         <address class="adr">
                              <p class="street-address">3000 Landerholm Circle SE</p>
							  <p class="street-address">Bellevue, WA 98007-6406</p>
                         </address>
                     
                     	<ul>    
                            <li><a href="<?php echo home_url(); ?>/about/contact/"><strong>Contact Us</strong></a></li>
                            <li><a href="<?php echo home_url(); ?>/about/directions/"><strong>Map &amp; directions</strong></a></li>
                        </ul>
				</div><!-- span3 -->
                
                <div class="span3">
					
                    <h4>Music Requests</h4>
                    <ul>
					<li><a href="mailto:dj@kbcs.fm">dj@kbcs.fm</a></li>
					<li>425-564-2424</li>
					</ul>
				</div><!-- span3 -->

				<div class="span3">
					<h4>News Department</h4>
                    <ul>
					<li><a href="mailto:dj@kbcs.fm">news@kbcs.fm</a></li>
					<li>425-564-6195</li>
					</ul>
				</div><!-- span3 -->
	
	
				<div class="span3">
					<h4>Connect</h4>
					<ul>
						<li><a href="<?php echo home_url(); ?>/support/business/">Business Support</a></li>
                        <li><a href="<?php echo home_url(); ?>/donate/">Donate</a></li>
						<li><a href="<?php echo home_url(); ?>/support/volunteer/">Volunteer</a></li>
						<li><a href="<?php echo home_url(); ?>/support/">Support Us</a></li>
					</ul>
				</div><!-- span3 -->

				<div class="span3">
					<h4>Legal</h4>
					<ul>
                        <li><a href="<?php echo home_url(); ?>/kbcs-public-files/">KBCS Public Files</a></li>
						<li><a href="https://www.bellevuecollege.edu/trustees/">Controlling Board of KBCS</a></li>
						<li><a href="https://www.bellevuecollege.edu/events/trustees/">Board Meetings</a></li>
					</ul>
				</div><!-- span3 -->

				<div class="span3">
					<h4>Listener comments</h4>
					<ul>
                    <li><a href="mailto:listenercomment@kbcs.fm">listenercomment@kbcs.fm</a></li>
                    </ul>
                </div><!-- span3 -->
			</nav>

			<div id="bclogo" class="span">
                	<p class="bc-service">91.3 KBCS is a public service at</p>
                    <a href="https://www.bellevuecollege.edu">
						<img src="<?php bloginfo('stylesheet_directory'); ?>/img/bellevuecollege.png" alt="Bellevue College" />
					</a>
			</div> <!--bclogo-->
		
		</footer><!-- footer .container -->

<?php wp_footer(); ?>

<!-- <?php
$kbcs_site_version = wp_get_theme();
echo $kbcs_site_version->Name . " theme version " . $kbcs_site_version->Version;
?>  -->

<script>
// Track initialized scripts
var initializedScripts = [];
document.querySelectorAll('script').forEach(function(script) {
    if (script.src) {
        initializedScripts.push(script.src);
    }
});

// Re-initialize scripts after Barba transitions
barba.hooks.after((data) => {
    // Find any new scripts in the loaded content
    const parser = new DOMParser();
    const newDoc = parser.parseFromString(data.next.html, 'text/html');
    const newScripts = newDoc.querySelectorAll('script');
    
    newScripts.forEach(script => {
        if (script.src && !initializedScripts.includes(script.src)) {
            // Load new external scripts
            const scriptEl = document.createElement('script');
            scriptEl.src = script.src;
            document.body.appendChild(scriptEl);
            initializedScripts.push(script.src);
        } else if (script.textContent) {
            // Evaluate inline scripts
            eval(script.textContent);
        }
    });

    // Trigger WordPress ready event
    if (typeof jQuery !== 'undefined') {
        jQuery(document).trigger('ready');
    }
});
</script>

</body>
</html>
