<?php
### Sidebar - Contains Sub Page navigation
### Automatically appears if sub-nav exists
?>
<aside class="sidebar span4">
	<nav aria-label="Social Links" id="social-links">
		<div>
			<a class="btn btn-primary btn-block" href="https://www.facebook.com/KBCSBellevueSeattle"><i class="icon-facebook"></i> Facebook</a>
		</div>
		<div>
			<a class="btn btn-info btn-block" href="https://twitter.com/KBCS"><i class="icon-twitter"></i> Twitter</a>
		</div>
		<div>
			<a class="btn btn-default btn-block" href="https://bellevuecollegefoundation.thankyou4caring.org/kbcs/email_communication">Newsletter</a>
		</div>
	</nav>
	<?php
 $args = [
     "post_type" => "ads",
     "post_status" => "publish",
     "posts_per_page" => 1,
     "orderby" => "date",
     "order" => "ASC",
 ];
 $query = new WP_Query($args);

 while ($query->have_posts()):
     $query->the_post(); ?>
		<div id="ad-manager">
			<a href="<?php echo get_post_meta(get_the_id(), "_links_to", true); ?>">
				<?php echo the_post_thumbnail("sidebar-ad"); ?>
			</a>
			<small style="display: block;">KBCS thanks our sponsors</small>
		</div><!-- ad-manager -->

	<?php
 endwhile;
 wp_reset_postdata();
 ?>
	<?php dynamic_sidebar("Events Widget Area"); ?>

	<?php dynamic_sidebar("Sidebar Bottom"); ?>
</aside><!-- sidebar span4 -->
