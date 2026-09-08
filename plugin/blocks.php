<?php
/**
 * Gutenberg Block Assets Registration
 *
 * @package Luiz0067_Carousel_Slides
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register block type and editor script
 */
function luiz0067_carousel_register_block() {
	$slide_show_js = dirname( __FILE__ ) . '/../js/blocks/slide-show.js';
	if ( file_exists( $slide_show_js ) ) {
		wp_register_script(
			'luiz0067-carousel-block-editor',
			plugins_url( '/../js/blocks/slide-show.js', __FILE__ ),
			array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'jquery' ),
			filemtime( $slide_show_js ),
			true
		);
		$i18n_file = dirname( __FILE__ ) . '/../languages/pt-br.json';
		$i18n_data = array();
		if ( file_exists( $i18n_file ) ) {
			$json_content = file_get_contents( $i18n_file );
			$decoded      = json_decode( $json_content, true );
			if ( is_array( $decoded ) ) {
				$i18n_data = $decoded;
			}
		}
		wp_localize_script( 'luiz0067-carousel-block-editor', 'luiz0067_carousel_i18n', $i18n_data );
	}

	register_block_type( 'luiz0067/carousel-slides', array(
		'editor_script' => 'luiz0067-carousel-block-editor',
		'style'         => 'luiz0067-carousel-style',
	) );
}
add_action( 'init', 'luiz0067_carousel_register_block' );
