<?php


class Soul_Activation {

	function __construct(){
		add_action( 'after_switch_theme', array( $this, 'after_switch_theme') );
	}

	function after_switch_theme(){

		// If WP-API exists, we are good to go
		if ( class_exists('WP_JSON_Posts') ){
			return;
		}

		switch_theme( WP_DEFAULT_THEME, WP_DEFAULT_THEME );
		unset( $_GET['activated'] );
		add_action( 'admin_notices', array( $this, 'admin_notices') );
	}

	function admin_notices(){
		$message =  __( 'Soul requires <a href="https://github.com/WP-API/WP-API">WP-API</a>.', 'soul' );
		printf( '<div class="error"><p>%s</p></div>', $message );
	}

}

new Soul_Activation();
