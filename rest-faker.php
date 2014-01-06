<?php

class Soul_JSON_Posts_Faker extends WP_JSON_Posts {
	public function format_posts( $posts ) {
		$formatted = array();
		foreach( $posts as $post ) {
			$formatted[] = $this->prepare_post( (array) $post );
		}
		return $formatted;
	}

	public function checkReadPermission( $post = array() ) {
		return true;
	}
}

function soul_get_posts() {
	global $wp_query;
	static $faker;
	if ( ! $faker ) {
		include_once( WP_PLUGIN_DIR . '/json-rest-api/lib/class-wp-json-server.php' );
		$faker = new Soul_JSON_Posts_Faker( new WP_JSON_Server );
	}
	return $faker->format_posts( $wp_query->posts );
}