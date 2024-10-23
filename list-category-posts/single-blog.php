<?php get_header(); ?>

<div class="whatpageisthis">single-blog.php</div>		

	<div class="container">
        <div class="row">	
            <div class="span8" id="content">


		<?php 
			$query = new WP_Query( array(
                'post_type' => 'blog',
                'category_name' => 'news-and-ideas'
            ) ); 
		?>
		<?php 
		if ( have_posts() ) : while ( have_posts() ) : the_post(); 

		if(!get_post_format()) {
				               get_template_part('format', 'standard');
			         } else {
				               get_template_part('format', get_post_format());
				          }

					endwhile;
					posts_nav_link();
					wp_reset_query();
					endif; ?>


			</div><!--#content .span8 -->
			<?php get_sidebar(); ?>
		</div><!-- row -->
	</div><!-- container -->
<?php get_footer(); ?>