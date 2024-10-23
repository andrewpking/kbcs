<article>
<h2 <?php post_class() ?>><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
<div class="media">
	<div class="media-left">
		<?php
		if ( has_post_thumbnail() ) {
			the_post_thumbnail( 'thumbnail', array( 'class' => 'media-object' ) );
			if( get_post( get_post_thumbnail_id() )->post_excerpt ) {
		?>
		<span class="featured-caption media-object"><?php echo get_post( get_post_thumbnail_id() )->post_excerpt ?></span>
		<?php
			}
		}
		?>
	</div>
		<section class="media-content">
			<p><small><?php the_time( 'F j, Y' ); ?> - <?php the_time( 'g:i a' ); ?></small></p>
			<?php
			if ( @strpos( $post->post_content, '<!--more-->') ) {
				global $more;
				$old_more = $more;
				$more = 0;
				the_content( custom_excerpt_more( NULL ) );
				$more = $old_more;
			} else {
				the_excerpt();
			}
			?>
		</section>
</div>
</article>
