<?php

defined( 'SOUL_LOCAL_DEV' ) or define( 'SOUL_LOCAL_DEV', false );
define( 'SOUL_VERSION', '0.2' );

// usually I don't want to look at the thing while dev'ing. YMMV.
if ( SOUL_LOCAL_DEV ) {
	show_admin_bar( false );
}

// Needs to go first, checks to make sure everything will work on activation
require __DIR__ . '/_activation.php';


require __DIR__ . '/vendor/autoload.php';

if ( class_exists('WP_JSON_Posts') ){
	require __DIR__ . '/rest-faker.php';
}

function soul_render( $template, $data = array() ) {
	static $mustache;
	if ( ! $mustache ) {
		$mustache = new Mustache_Engine( array(
			'loader' => new Mustache_Loader_FilesystemLoader( __DIR__ . '/templates' ),
		) );
	}
	echo $mustache->render( $template, $data );
}

add_action( 'wp_enqueue_scripts', 'soul_enqueue' );
function soul_enqueue() {
	$base_url = get_template_directory_uri();
	$min = SOUL_LOCAL_DEV ? '' : '.min';
	$version = SOUL_LOCAL_DEV ? mt_rand( 1, 10000 ) : SOUL_VERSION;

	wp_enqueue_style( 'soul', "{$base_url}/css/soul{$min}.css", '', $version );
	wp_enqueue_script( 'soul', "{$base_url}/js/soul{$min}.js", array( 'jquery' ), $version, true );

	// in case we have a path-based home, we need this.
	$url = parse_url( trailingslashit( home_url() ) );

	wp_localize_script( 'soul', '_Soul', array(
		'urlRoot' => json_url(),
		'root' => $url['path'],
		'home' => trailingslashit( home_url() )
	) );


	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) )
		wp_enqueue_script( 'comment-reply' );
}


function soul_next_page_url() {
	global $paged, $wp_query;
	$maxpages = $wp_query->max_num_pages;
	if ( ! $paged ) {
		$paged = 1;
	}
	$nextpage = intval($paged) + 1;
	if ( ! is_single() && ( $nextpage <= $maxpages ) ) {
		return get_next_posts_page_link( $maxpages );
	}
	return false;
}

function soul_prev_page_url() {
	global $paged;
	if ( ! is_single() && $paged > 1 ) {
		return get_previous_posts_page_link();
	}
	return false;
}
