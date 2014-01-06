<?php get_header(); ?>
	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
		<?php soul_render( 'index', array(
			'posts' => soul_get_posts(),
			'nextpage' => soul_next_page_url(),
			'prevpage' => soul_prev_page_url() ) );
		?>
		</main><!-- #main -->
	</div><!-- #primary -->
<?php get_footer(); ?>