<?php

namespace CookieLawConsent\Admin;

use const CookieLawConsent\SERVICES;
class SettingsPage {

	const OPTIONS_PAGE_NAME = 'cookie-law-consent-settings';

	const SECTION_NAME = 'cookie_law_consent-section';
	const SECTION_CATEGORIES = 'cookie_law_consent-section-categories';
	const SECTION_SERVICES = 'cookie_law_consent-section-services';

	const SETTINGS_NAME  = 'cookie_law_consent';
	const SETTINGS_GROUP = 'cookie_law_consent_setting_group';

	const FIELD_BANNER_POSITION = 'banner_position';
	const FIELD_EXTERNAL_STYLES = 'external_styles';
	const FIELD_CATEGORIES = 'categories';
	const FIELD_SERVICES = 'services';

	/**
	 * Holds the values to be used in the fields callbacks
	 */
	private $config;

	/**
	 * Start up
	 */
	public function __construct() {
		add_action( 'admin_menu', [$this, 'add_plugin_page'] );
		add_action( 'admin_enqueue_scripts', [$this, 'enqueue_assets'] );

		add_action( 'admin_init', [$this, 'regsiter_settings_fields'] );
	}

	/**
	 * Add options page
	 */
	public function add_plugin_page() {
		// This page will be under "Settings"
		add_options_page(
			__( 'Cookie law Consent Options', 'cookielawconsent'),
			__( 'Cookie Law Consent', 'cookielawconsent' ),
			'manage_options',
			self::OPTIONS_PAGE_NAME,
			[$this, 'render_option_page']
		);
	}

	function enqueue_assets( $hook ) {
		if( 'settings_page_cookie-law-consent-settings' !== $hook ) return;

		wp_enqueue_style( 'cookie_law_consent-admin-styles', plugins_url('../build/cookie-law-consent-admin.css', __FILE__), null, CLC_PLUGIN_VERSION );
		wp_enqueue_script( 'cookie_law_consent-admin-js', plugins_url('../build/cookie-law-consent-admin.js', __FILE__), null, CLC_PLUGIN_VERSION, true );
	}

	/**
	 * Register and add settings
	 */
	public function regsiter_settings_fields() {
		// Set class property
		$this->options = get_option(self::SETTINGS_NAME);

		register_setting(
			self::SETTINGS_GROUP, // Option group
			self::SETTINGS_NAME, // Option name
			[$this, 'sanitize'] // Sanitize
		);


		add_settings_section(
			self::SECTION_NAME, // ID
			__('Appearance', 'cookielawconsent'), // Title
			null,
			self::OPTIONS_PAGE_NAME // Page
		);

		add_settings_field(
			self::FIELD_BANNER_POSITION, // ID -> field name
			__('Banner position', 'cookielawconsent'), // Title
			[$this, 'render_select_field'], // Callback
			self::OPTIONS_PAGE_NAME, // Page
			self::SECTION_NAME, // Section
			[
				'label_for' => self::FIELD_BANNER_POSITION,
				'id'        => self::FIELD_BANNER_POSITION,
				'value'     => (isset( $this->options[self::FIELD_BANNER_POSITION] ) ? $this->options[self::FIELD_BANNER_POSITION] : '-1'),
				'options'   => [
					'-1'           => _x( 'Select a position', 'Option page select', 'cookielawconsent' ),
					'top-left'     => _x( '↖ Top left corner', 'Option page select', 'cookielawconsent' ),
					'top-right'    => _x( '↗ Top right corner', 'Option page select', 'cookielawconsent' ),
					'center'       => _x( '✛ Center', 'Option page select', 'cookielawconsent' ),
					'bottom-left'  => _x( '↙ Bottom left corner', 'Option page select', 'cookielawconsent' ),
					'bottom-right' => _x( '↘ Bottom right corner', 'Option page select', 'cookielawconsent' ),
				],
			]
		);
		add_settings_field(
			self::FIELD_EXTERNAL_STYLES,
			__('External styles', 'cookielawconsent'),
			[$this, 'render_switch_field'],
			self::OPTIONS_PAGE_NAME,
			self::SECTION_NAME,
			[
				'id'        => self::FIELD_EXTERNAL_STYLES,
				'label_for' => self::FIELD_EXTERNAL_STYLES,
				'checked'   => (isset($this->options[self::FIELD_EXTERNAL_STYLES]) && $this->options[self::FIELD_EXTERNAL_STYLES]),
			]
		);


		add_settings_section(
			self::SECTION_CATEGORIES,
			__('Categories', 'cookielawconsent'),
			function() { _e('Define the categories of cookies with a description for the user the understand and the cookies are intend for.', 'cookielawconsent'); },
			self::OPTIONS_PAGE_NAME
		);

		add_settings_field(
			self::FIELD_CATEGORIES,
			null, //__('Categories', 'cookielawconsent'), // TODO find how to not render the <th>
			[$this, 'render_categories_field'],
			self::OPTIONS_PAGE_NAME,
			self::SECTION_CATEGORIES
		);


		add_settings_section(
			self::SECTION_SERVICES,
			__('Services', 'cookielawconsent'),
			function() { _e('Enable adn define external services', 'cookielawconsent'); },
			self::OPTIONS_PAGE_NAME
		);

		add_settings_field(
			self::FIELD_SERVICES,
			null, //__('Services', 'cookielawconsent'), // TODO find how to not render the <th>
			[$this, 'render_services_field'],
			self::OPTIONS_PAGE_NAME,
			self::SECTION_SERVICES
		);
	}

	/**
	 * Sanitize each setting field as needed
	 *
	 * @param array $input Contains all settings fields as array keys
	 */
	public function sanitize( $fields ) {

		$sanitized_fields = [];

		if( isset( $fields[self::FIELD_BANNER_POSITION] ) ) {
			$sanitized_fields[self::FIELD_BANNER_POSITION] = sanitize_text_field( $fields[self::FIELD_BANNER_POSITION] );
		}

		$sanitized_fields[self::FIELD_EXTERNAL_STYLES] = isset($fields[self::FIELD_EXTERNAL_STYLES]);

		$sanitized_fields[self::FIELD_CATEGORIES] = array_map(
			function($cat) {
				$cat['mandatory'] = isset( $cat['mandatory'] );
				$cat['name'] = sanitize_title( $cat['title'] );
				$cat['texts'] = array_filter($cat['texts']);
				return $cat;
			},
			array_filter(
				$fields[self::FIELD_CATEGORIES],
				function($cat) {
					return !empty($cat['title']);
				}
			)
		);

		$sanitized_fields[self::FIELD_SERVICES] = array_filter(
			$fields[self::FIELD_SERVICES],
			function($srv) {
				return isset($srv['enabled']);
			}
		);

		return $sanitized_fields;
	}

	/**
	 * Render the option page
	 */
	public function render_option_page() {
		?>
		<div class="wrap">
			<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
			<form method="post" action="options.php">
				<?php
					// This prints out all hidden setting fields
					settings_fields( self::SETTINGS_GROUP );
					do_settings_sections( self::OPTIONS_PAGE_NAME );
					submit_button();
				?>
			</form>
		</div>
		<?php
	}

	// ***** FIELDS render callbacks

	public function render_select_field($args) {
		$options = [];

		foreach ($args['options'] as $value => $label) {
			$options[] = sprintf('<option %s %s value="%s">%s</option>',
				selected( $value, $args['value'], false ),
				($value == '-1' ? 'disabled' : ''),
				$value,
				$label
			);
		}

		$name = isset($args['name'])
			? $args['name']
			: self::SETTINGS_NAME."[{$args['id']}]";

		printf(
			'<select id="%s" name="%s">%s</select>',
			$args['id'],
			$name,
			implode('', $options)
		);
	}

	public function render_switch_field($args) {
		$name = isset($args['name'])
			? $args['name']
			: self::SETTINGS_NAME."[{$args['id']}]";

		printf(
			'<div class="switch"><input class="switch__chk" type="checkbox" id="%1$s" name="%2$s" %3$s><label for="%1$s" class="switch__label" tabindex="-1"></label></div>',
			$args['id'],
			$name,
			($args['checked']  ? 'checked' : '')
		);
	}

	public function render_categories_field() {

		$categories = $this->options[self::FIELD_CATEGORIES];

		?>
		<div class="categories" tabulation data-setting-name="<?php echo self::SETTINGS_NAME; ?>">
			<nav class="categories__nav">
				<div class="categories__tab-list" tab-list>
					<?php /* rendered in javascript */ ?>
				</div>
				<button class="categories__add">+</button>
			</nav>
			<div class="categories__panel-list" panel-list>
				<?php foreach ($categories as $i => $cat) : ?>
					<div id="category_<?php echo $cat['name']; ?>" class="category<?php if ($i === 0) echo ' is-active'; ?>" data-idx="<?php echo $i; ?>">
						<table class="form-table">
							<tr class="row">
								<th><label for="<?php echo $cat['name']; ?>-mandatory">Mandatory ?</label></th>
								<td>
									<div class="switch">
										<input id="<?php echo $cat['name']; ?>-mandatory" name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][mandatory]" type="checkbox" class="switch__chk" <?php if ($cat['mandatory']) echo 'checked'; ?>/>
										<label for="<?php echo $cat['name']; ?>-mandatory" class="switch__label">mandatory ?</label>
									</div>
								</td>
							</tr>
							<tr class="row">
								<th><label for="<?php echo $cat['name']; ?>-title">Title</label></th>
								<td>
									<input id="<?php echo $cat['name']; ?>-title" name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][title]" type="text" value="<?php echo $cat['title']; ?>" class="category__title"/>
								</td>
							</tr>
							<tr class="row">
								<th><label for="<?php echo $cat['name']; ?>-description">Description</label></th>
								<td>
									<textarea id="<?php echo $cat['name']; ?>-description" name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][description]" ><?php echo $cat['description']; ?></textarea>
								</td>
							</tr>
							<tr class="row">
								<th><h3>Custom Texts</h3></th>
							</tr>
							<tr>
								<th><label for="<?php echo $cat['name']; ?>-texts-enable">Enable</label></th>
								<td>
									<input
										id="<?php echo $cat['name']; ?>-texts-enable"
										type="text"
										name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][texts][enable]"
										placeholder="Enable cookies"
										value="<?php if (isset($cat['texts']['enable'])) echo $cat['texts']['enable']; ?>"
									/>
								</td>
								<th><label for="<?php echo $cat['name']; ?>-texts-enabled">Enabled</label></th>
								<td>
									<input
										id="<?php echo $cat['name']; ?>-texts-enabled"
										type="text"
										name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][texts][enabled]"
										placeholder="Enabled"
										value="<?php if (isset($cat['texts']['enabled'])) echo $cat['texts']['enabled']; ?>"
									/>
								</td>
							</tr>
							<tr>
								<th><label for="<?php echo $cat['name']; ?>-texts-disable">Disable</label></th>
								<td>
									<input
										id="<?php echo $cat['name']; ?>-texts-disable"
										type="text"
										name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][texts][disable]"
										placeholder="Disable cookies"
										value="<?php if (isset($cat['texts']['disable'])) echo $cat['texts']['disable']; ?>"
									/>
								</td>
								<th><label for="<?php echo $cat['name']; ?>-texts-disabled">Disabled</label></th>
								<td>
									<input
										id="<?php echo $cat['name']; ?>-texts-disabled"
										type="text"
										name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][texts][disabled]"
										placeholder="Disabled"
										value="<?php if (isset($cat['texts']['disabled'])) echo $cat['texts']['disabled']; ?>"
									/>
								</td>
							</tr>
							<tr>
								<th><label for="<?php echo $cat['name']; ?>-texts-alwaysEnabled">Always Enabled <br><small><em>Mandatory category</em></small></label></th>
								<td>
									<input
										id="<?php echo $cat['name']; ?>-texts-alwaysEnabled"
										type="text"
										name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][texts][alwaysEnabled]"
										placeholder="Always enabled"
										value="<?php if (isset($cat['texts']['alwaysEnabled'])) echo $cat['texts']['alwaysEnabled']; ?>"
									/>
								</td>
							</tr>
						</table>
					</div>
				<?php endforeach ?>
			</div>
		</div>

		<?php
	}

	public function render_services_field() {

		$categoriesOptions = [ '-1' => __( 'Select a category', 'cookielawconsent' ) ];
		foreach($this->options['categories'] as $cat) {
			$categoriesOptions[$cat['name']] = $cat['title'];
		}

		?>
		<div class="services" tabulation>
			<nav class="services__nav" tab-list>
				<?php foreach (SERVICES as $i => $srv) : ?>
					<a href="#service_<?php echo $srv['name']; ?>" class="services__tab<?php if ($i === 0) echo ' is-active'; ?>"><?php echo $srv['title']; ?></a>
				<?php endforeach ?>
			</nav>
			<div class="services__panel-list" panel-list>
				<?php foreach (SERVICES as $i => $srv) : ?>
					<?php
						if ( isset($this->options[self::FIELD_SERVICES][$srv['name']]) ) {
							$data = $this->options[self::FIELD_SERVICES][$srv['name']];

							$srv['enabled'] = true;
							if ( isset($data['category']) ) $srv['category'] = $data['category'];

							foreach ($srv['fields'] as $fIdx => $fld) {
								$srv['fields'][$fIdx]['value'] = ($fld['type'] === 'switch'
									? isset($data[$fld['name']])
									: $data[$fld['name']]
								);
							}
						}

					?>
					<div id="service_<?php echo $srv['name']; ?>" class="service<?php if ($i === 0) echo ' is-active'; ?>">
						<?php if ( !empty($srv['info']) ) : ?>
							<em class="service__description">
								<?php echo $srv['info']; ?>
							</em>
						<?php endif; ?>
						<table class="form-table">
							<tr class="row service__row-enable">
								<th><label for="<?php echo "service-enabled-{$srv['name']}"; ?>">Enable?</label></th>
								<td >
									<?php $this->render_switch_field([
										'id'      => "service-enabled-{$srv['name']}",
										'name'    => self::SETTINGS_NAME ."[services][{$srv['name']}][enabled]",
										'checked' => $srv['enabled'],
									]); ?>
								</td>
							</tr>
							<tr class="row">
								<th><label for="<?php echo "service-category-{$srv['name']}"; ?>">Category</label></th>
								<td>
									<?php
									$this->render_select_field([
										'id'      => "service-category-{$srv['name']}",
										'name'    => self::SETTINGS_NAME ."[services][{$srv['name']}][category]",
										'value'   => (empty($srv['category']) ? '-1' : $srv['category']),
										'options' => $categoriesOptions,
									]); ?>
								</td>
							</tr>
							<?php foreach($srv['fields'] as $field) : ?>
								<tr class="row">
									<th><label for="<?php echo $field['name']; ?>"><?php echo $field['label']; ?></label></th>
									<td>
										<?php
										$name = self::SETTINGS_NAME ."[services][{$srv['name']}][{$field['name']}]";
										$value = ( isset($field['value'])
											? $field['value']
											: ( isset($field['default']) ? $field['default'] : '' )
										);

										switch ($field['type']) {
											case 'switch':
												$this->render_switch_field([ 'id' => $field['name'], 'name' => $name, 'checked' => $value ]);
												break;

											default:
												echo '<input id="'. $field['name'] .'" name="'. $name .'" type="'. $field['type'] .'" value="'. $value .'" placeholder="'. $field['placeholder'] .'"/>';
												break;
										}
										?>
									</td>
								</tr>
							<?php endforeach ?>
						</table>
					</div>
				<?php endforeach ?>
			</div>
		</div>
		<?php
	}
}
