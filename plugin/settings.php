<?php
/**
 * Settings Page for luiz0067 Carousel Slides
 *
 * @package Luiz0067_Carousel_Slides
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register plugin settings
 */
function luiz0067_carousel_register_settings() {
	register_setting(
		'luiz0067_carousel_settings_group',
		'luiz0067_carousel_language',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'luiz0067_carousel_sanitize_language',
			'default'           => 'auto',
		)
	);
}
add_action( 'admin_init', 'luiz0067_carousel_register_settings' );

/**
 * Sanitize language input
 *
 * @param string $input Selected language code.
 * @return string
 */
function luiz0067_carousel_sanitize_language( $input ) {
	$valid_languages = array( 'auto', 'pt-br', 'en', 'es' );
	if ( in_array( $input, $valid_languages, true ) ) {
		return $input;
	}
	return 'auto';
}

/**
 * Add settings page to WordPress Admin Menu under "Settings"
 */
function luiz0067_carousel_add_admin_menu() {
	add_options_page(
		'luiz0067 Carousel Slides',
		'luiz0067 Carousel',
		'manage_options',
		'luiz0067-carousel-settings',
		'luiz0067_carousel_render_settings_page'
	);
}
add_action( 'admin_menu', 'luiz0067_carousel_add_admin_menu' );

/**
 * Add Settings shortcut link to Plugins list page
 *
 * @param array $links Array of action links.
 * @return array
 */
function luiz0067_carousel_add_action_links( $links ) {
	$settings_url  = admin_url( 'options-general.php?page=luiz0067-carousel-settings' );
	$settings_link = '<a href="' . esc_url( $settings_url ) . '">' . esc_html__( 'Settings', 'carousel-block-slide-show' ) . '</a>';
	array_unshift( $links, $settings_link );
	return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( dirname( __DIR__ ) . '/luiz0067-carousel-slides.php' ), 'luiz0067_carousel_add_action_links' );

/**
 * Render the settings page HTML
 */
function luiz0067_carousel_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$current_lang = get_option( 'luiz0067_carousel_language', 'auto' );
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
		
		<div class="card" style="max-width: 650px; margin-top: 20px; padding: 20px 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 8px;">
			<form method="post" action="options.php">
				<?php
				settings_fields( 'luiz0067_carousel_settings_group' );
				?>
				
				<h2 style="margin-top: 0; padding-bottom: 10px; border-bottom: 1px solid #eee;">
					<?php esc_html_e( 'Block Editor Language / Idioma do Bloco', 'carousel-block-slide-show' ); ?>
				</h2>

				<p style="color: #646970; font-size: 14px; margin-bottom: 20px;">
					<?php esc_html_e( 'Select the language displayed in the Gutenberg block editor interface:', 'carousel-block-slide-show' ); ?>
				</p>

				<table class="form-table" role="presentation" style="margin-top: 0;">
					<tbody>
						<tr>
							<th scope="row" style="padding-top: 10px;">
								<label for="luiz0067_carousel_language"><strong><?php esc_html_e( 'Language / Idioma', 'carousel-block-slide-show' ); ?></strong></label>
							</th>
							<td style="padding-top: 10px;">
								<select name="luiz0067_carousel_language" id="luiz0067_carousel_language" style="min-width: 260px; height: 36px; border-radius: 4px;">
									<option value="auto" <?php selected( $current_lang, 'auto' ); ?>>
										<?php esc_html_e( 'Auto (WordPress Default / Detect)', 'carousel-block-slide-show' ); ?>
									</option>
									<option value="pt-br" <?php selected( $current_lang, 'pt-br' ); ?>>
										Português (Brasil)
									</option>
									<option value="en" <?php selected( $current_lang, 'en' ); ?>>
										English
									</option>
									<option value="es" <?php selected( $current_lang, 'es' ); ?>>
										Español
									</option>
								</select>
								<p class="description" style="margin-top: 8px;">
									<?php esc_html_e( 'Choose a specific language to override WordPress locale in the block editor.', 'carousel-block-slide-show' ); ?>
								</p>
							</td>
						</tr>
					</tbody>
				</table>

				<?php submit_button( esc_html__( 'Save Changes', 'carousel-block-slide-show' ), 'primary', 'submit', true, array( 'style' => 'margin-top: 15px;' ) ); ?>
			</form>
		</div>
	</div>
	<?php
}
