<article>
<h2 <?php post_class() ?>>							
	<a href="<?php the_permalink(); ?>"><?php the_title();?></a>
</h2>

<p><small><?php the_time('F j, Y'); ?> - <?php the_time('g:i a'); ?></small></p>

<div class="video-container">
	<?php the_content(); ?>
</div>
</article>