<?php
namespace CookieLawConsent\Admin;

class SettingsPage {

	const SETTING_NAME_JSON_CONFIG = 'json_config';

	/**
	 * Holds the values to be used in the fields callbacks
	 */
	private $config;

	/**
	 * Start up
	 */
	public function __construct() {
		add_action( 'admin_menu', [$this, 'add_plugin_page'] );
		add_action( 'admin_init', [$this, 'page_init'] );
	}

	/**
	 * Add options page
	 */
	public function add_plugin_page() {
		// This page will be under "Settings"
		add_options_page(
			'Settings Admin',
			__( 'Cookie Law Consent', 'cookielawconsent' ),
			'manage_options',
			'cookie-law-consent-settings',
			[$this, 'create_admin_page']
		);
	}

	/**
	 * Options page callback
	 */
	public function create_admin_page() {
		// Set class property
		$this->options = get_option( 'json_config' );

		?>
		<div class="wrap">
			<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
			<form method="post" action="options.php">
				<?php
					// This prints out all hidden setting fields
					settings_fields( 'clc_settings_group' );
					do_settings_sections( 'cookie-law-consent-settings' );
					submit_button();
				?>
			</form>
		</div>
		<?php
	}

	/**
	 * Register and add settings
	 */
	public function page_init() {
		register_setting(
			'clc_settings_group', // Option group
			'json_config', // Option name
			[$this, 'sanitize'] // Sanitize
		);

		add_settings_section(
			'setting_section_id', // ID
			__('Configuration', 'cookielawconsent'), // Title
			[$this, 'print_section_info'], // Callback
			'cookie-law-consent-settings' // Page
		);

		add_settings_field(
			'json_config_field', // ID
			__('JSON', 'cookielawconsent'), // Title
			[$this, 'field_callback'], // Callback
			'cookie-law-consent-settings', // Page
			'setting_section_id' // Section
		);
	}

	/**
	 * Sanitize each setting field as needed
	 *
	 * @param array $input Contains all settings fields as array keys
	 */
	public function sanitize( $input ) {

		$new_input = [];
		if( isset( $input['json_config_field'] ) )
			$new_input['json_config_field'] = json_encode( $input['json_config_field'] );

		// if( isset( $input['title'] ) )
		// 	$new_input['title'] = sanitize_text_field( $input['title'] );

		return $new_input;
	}

	/**
	 * Print the Section text
	 */
	public function print_section_info() {
		_e('Define your settings in a JSON format', 'cookielawconsent');
	}

	/**
	 * Get the settings option array and print one of its values
	 */
	public function field_callback() {
		printf(
			'<textarea id="json_config_field" name="%s" style="width:100%%;min-height:400px;">%s</textarea>',
			"json_config[json_config_field]",
			isset( $this->options['json_config_field'] ) ? esc_attr( json_decode($this->options['json_config_field'])) : ''
		);
	}
}
