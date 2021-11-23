<?php

namespace CookieLawConsent\Admin;

use function CookieLawConsent\is_multilingual;
use function CookieLawConsent\get_current_lang;
use function CookieLawConsent\get_default_lang;
use function CookieLawConsent\get_language_full_name;
use function CookieLawConsent\get_translated_text;

use const CookieLawConsent\SERVICES;
class SettingsPage {

	const OPTIONS_PAGE_NAME = 'cookie-law-consent-settings';

	const SECTION_NAME = 'cookie_law_consent-section';
	const SECTION_TEXTS = 'cookie_law_consent-section-texts';
	const SECTION_CATEGORIES = 'cookie_law_consent-section-categories';
	const SECTION_SERVICES = 'cookie_law_consent-section-services';

	const SETTINGS_NAME  = 'cookie_law_consent';
	const SETTINGS_GROUP = 'cookie_law_consent_setting_group';

	// const FIELD_BANNER_POSITION = 'banner_position';
	const FIELD_HASH = 'hash';
	const FIELD_BANNER_TEXTS = 'banner_texts';
	const FIELD_MODAL_TEXTS = 'modal_texts';
	const FIELD_CATEGORIES = 'categories';
	const FIELD_SERVICES = 'services';

	/**
	 * Holds the values to be used in the fields callbacks
	 */
	private $options;

	/**
	 * Start up
	 */
	public function __construct() {
		add_action( 'admin_menu', [$this, 'add_plugin_page'] );
		add_action( 'admin_enqueue_scripts', [$this, 'enqueue_assets'] );

		add_action( 'admin_init', [$this, 'register_settings_fields'] );
	}

	public static function insert_default_settings() {
		$default = [];
		// $default[self::FIELD_BANNER_POSITION] = 'bottom-right';
		$default[self::FIELD_HASH] = 'manage-cookies';
		$default[self::FIELD_CATEGORIES] = [
			[
				'position'    => 1,
				'mandatory'   => true,
				'id'          => 'necessary',
				'title'       => __('Necessary', 'cookielawconsent'),
				'description' => __('Necessary cookies are absolutely essential for the website to function properly. This category only includes cookies that ensures basic functionalities and security features of the website. These cookies do not store any personal information.', 'cookielawconsent'),
			],
			[
				'position'    => 2,
				'mandatory'   => false,
				'id'          => 'analytics',
				'title'       => __('Analytics', 'cookielawconsent'),
				'description' => __('Analytics cookies help us understand how our visitors interact with the website. It helps us understand the number of visitors, where the visitors are coming from, and the pages they navigate. The cookies collect this data and are reported anonymously.', 'cookielawconsent'),
			]
		];

		add_option( self::SETTINGS_NAME, $default, false );
	}

	public static function remove_settings() {
		delete_option( self::SETTINGS_NAME );
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

		wp_enqueue_style( 'cookie_law_consent-admin-styles', plugins_url('cookie-law-consent-admin.css', __FILE__), null, CLC_PLUGIN_VERSION );
		wp_enqueue_script( 'cookie_law_consent-admin-js', plugins_url('cookie-law-consent-admin.js', __FILE__), null, CLC_PLUGIN_VERSION, true );
	}

	/**
	 * Register and add settings
	 */
	public function register_settings_fields() {
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
			function() {
				echo '<em>'.__('The Hash below is used in order to display the GDPR modal at any time from a link having this same hash as its url (prefixed with #).', 'cookielawconsent').'</em>';
			},
			self::OPTIONS_PAGE_NAME // Page
		);

		// add_settings_field(
		// 	self::FIELD_BANNER_POSITION, // ID -> field name
		// 	__('Banner position', 'cookielawconsent'), // Title
		// 	[$this, 'render_select_field'], // Callback
		// 	self::OPTIONS_PAGE_NAME, // Page
		// 	self::SECTION_NAME, // Section
		// 	[
		// 		'label_for' => self::FIELD_BANNER_POSITION,
		// 		'id'        => self::FIELD_BANNER_POSITION,
		// 		'value'     => (isset( $this->options[self::FIELD_BANNER_POSITION] ) ? $this->options[self::FIELD_BANNER_POSITION] : '-1'),
		// 		'options'   => [
		// 			'-1'           => _x( 'Select a position', 'Option page select', 'cookielawconsent' ),
		// 			'top-left'     => _x( '↖ Top left corner', 'Option page select', 'cookielawconsent' ),
		// 			'top-right'    => _x( '↗ Top right corner', 'Option page select', 'cookielawconsent' ),
		// 			'center'       => _x( '✛ Center', 'Option page select', 'cookielawconsent' ),
		// 			'bottom-left'  => _x( '↙ Bottom left corner', 'Option page select', 'cookielawconsent' ),
		// 			'bottom-right' => _x( '↘ Bottom right corner', 'Option page select', 'cookielawconsent' ),
		// 			'full-bottom'  => _x( '↔ Bottom full width', 'Option page select', 'cookielawconsent' ),
		// 		],
		// 	]
		// );

		add_settings_field(
			self::FIELD_HASH, // ID -> field name
			__('Hash', 'cookielawconsent'), // Title
			[$this, 'render_simple_text_field'], // Callback
			self::OPTIONS_PAGE_NAME, // Page
			self::SECTION_NAME, // Section
			[
				'label_for' => self::FIELD_HASH,
				'id'          => self::FIELD_HASH,
				'placeholder' => __('manage-cookies', 'cookielawconsent'),
				'value'       => (isset( $this->options[self::FIELD_HASH] ) ? $this->options[self::FIELD_HASH] : ''),
			]
		);

		add_settings_section(
			self::SECTION_TEXTS,
			_x('Custom texts', 'Global custom texts', 'cookielawconsent'),
			null,
			self::OPTIONS_PAGE_NAME
		);

		add_settings_field(
			self::FIELD_BANNER_TEXTS,
			__('Banner texts', 'cookielawconsent'),
			[$this, 'render_texts_field'],
			self::OPTIONS_PAGE_NAME,
			self::SECTION_TEXTS,
			[
				'id'        => self::FIELD_BANNER_TEXTS,
				'fields'    => [
					[ 'name' => 'title', 'label' => _x('Title', 'Banner text', 'cookielawconsent'), 'placeholder' => _x('Cookies', 'Banner Title', 'cookielawconsent' ) ],
					[ 'name' => 'acceptAll', 'label' => _x('Accept all button', 'Banner text', 'cookielawconsent'), 'placeholder' => _x('Accept', 'Banner Accept All', 'cookielawconsent' ) ],
					[ 'name' => 'message', 'type' => 'textarea', 'label' => _x('Description', 'Banner text', 'cookielawconsent'), 'placeholder' => _x('This website uses cookies to help improve your user experience and gives you control over what you want to activate.', 'Banner Message', 'cookielawconsent' ) ],
					[ 'name' => 'rejectAll', 'label' => _x('Reject all button', 'Banner text', 'cookielawconsent'), 'placeholder' => _x('Reject', 'Banner Reject All', 'cookielawconsent' ) ],
					[ 'name' => 'personalize', 'label' => _x('Personalize link', 'Banner text', 'cookielawconsent'), 'placeholder' => _x('Personalize', 'Banner Personalize', 'cookielawconsent' ) ],
				],
			]
		);
		add_settings_field(
			self::FIELD_MODAL_TEXTS,
			__('Modal texts', 'cookielawconsent'),
			[$this, 'render_texts_field'],
			self::OPTIONS_PAGE_NAME,
			self::SECTION_TEXTS,
			[
				'id'        => self::FIELD_MODAL_TEXTS,
				'fields'    => [
					[ 'name' => 'title', 'label' => _x('Title', 'Modal text', 'cookielawconsent'), 'placeholder' => _x('Cookie Settings', 'Modal Title', 'cookielawconsent' ) ],
					[ 'name' => 'close', 'label' => _x('Close button', 'Modal text', 'cookielawconsent'), 'placeholder' => _x('Close', 'Modal Personalize', 'cookielawconsent' ) ],
					[ 'name' => 'description', 'type' => 'textarea', 'label' => _x('Description', 'Modal text', 'cookielawconsent'), 'placeholder' => _x('This website uses cookies to improve your experience while you navigate through the website. Out of these cookies, the cookies that are categorized as necessary are stored on your browser as they are essential for the working of basic functionalities of the website. We also use third-party cookies that help us analyze and understand how you use this website. These cookies will be stored in your browser only with your consent. You also have the option to opt-out of these cookies. But opting out of some of these cookies may have an effect on your browsing experience.', 'Modal Description', 'cookielawconsent' ) ],
					[ 'name' => 'save', 'label' => _x('Save button', 'Modal text', 'cookielawconsent'), 'placeholder' => _x('Accept & save', 'Modal Accept All', 'cookielawconsent' ) ],
				],
			]
		);

		add_settings_section(
			self::SECTION_CATEGORIES,
			__('Categories', 'cookielawconsent'),
			function() { _e('Define the categories of cookies with a description for the user to understand what the cookies are intended for.', 'cookielawconsent'); },
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
			function() { _e('Enable and define external services', 'cookielawconsent'); },
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

		$settings = [];

		// if( isset( $fields[self::FIELD_BANNER_POSITION] ) ) {
		// 	$settings[self::FIELD_BANNER_POSITION] = sanitize_text_field( $fields[self::FIELD_BANNER_POSITION] );
		// }

		if( isset( $fields[self::FIELD_HASH] ) ) {
			$settings[self::FIELD_HASH] = sanitize_text_field( $fields[self::FIELD_HASH] );
		}

		$settings[self::FIELD_BANNER_TEXTS] = array_filter($fields[self::FIELD_BANNER_TEXTS]);
		$settings[self::FIELD_MODAL_TEXTS] = array_filter($fields[self::FIELD_MODAL_TEXTS]);

		$settings[self::FIELD_CATEGORIES] = array_values(array_map(
			function(Array $cat) {
				$cat['mandatory'] = isset( $cat['mandatory'] );
				$cat['position'] = (int)$cat['position'];
				$cat['texts'] = array_filter($cat['texts']);
				if (count($cat['texts']) === 0 ) unset($cat['texts']);

				return $cat;
			},
			array_filter(
				$fields[self::FIELD_CATEGORIES],
				function($cat) {
					return !empty($cat['title']);
				}
			)
		));

		usort($settings[self::FIELD_CATEGORIES], function($a, $b) {
			return $a['position'] - $b['position'];
		});

		$settings[self::FIELD_SERVICES] = array_filter(
			$fields[self::FIELD_SERVICES],
			function($srv) {
				return isset($srv['enabled']);
			}
		);

		if (is_multilingual()) {
			$currentLang = get_current_lang();
			$defaultLang = get_default_lang();

			$bannerTexts = [];
			$prevBannerTexts = $this->options[self::FIELD_BANNER_TEXTS];
			if ( is_array($prevBannerTexts) ) {
				if ( count(array_intersect_key(['title', 'message', 'personalize', 'acceptAll', 'rejectAll'], $prevBannerTexts)) > 0 ) $bannerTexts[$defaultLang] = $prevBannerTexts;
				else $bannerTexts = $prevBannerTexts;
			}
			$bannerTexts[$currentLang] = $settings[self::FIELD_BANNER_TEXTS];
			$settings[self::FIELD_BANNER_TEXTS] = $bannerTexts;

			$modalTexts = [];
			$prevModalTexts = $this->options[self::FIELD_MODAL_TEXTS];
			if ( is_array($prevModalTexts) ) {
				if ( count(array_intersect_key(['title', 'description', 'close', 'save'], $prevModalTexts)) > 0 ) $modalTexts[$defaultLang] = $prevModalTexts;
				else $modalTexts = $prevModalTexts;
			}
			$modalTexts[$currentLang] = $settings[self::FIELD_MODAL_TEXTS];
			$settings[self::FIELD_MODAL_TEXTS] = $modalTexts;


			$settings[self::FIELD_CATEGORIES] = array_map(function($cat) use ($currentLang, $defaultLang) {
				$prevCat = $this->get_category_by_id($cat['id']);

				if (is_array($prevCat['title'])) $title = $prevCat['title'];
				else {
					$title = [];
					$title[$defaultLang] = $prevCat['title'];
				}
				$title[$currentLang] = $cat['title'];


				if (is_array($prevCat['description']))  $desc = $prevCat['description'];
				else {
					$desc = [];
					$desc[$defaultLang] = $prevCat['description'];
				}
				$desc[$currentLang] = $cat['description'];

				$texts = [];
				if ( is_array($prevCat['texts']) ) {
					if ( count(array_intersect_key(['enable', 'enabled', 'disable', 'disabled', 'alwaysEnabled'], $prevCat['texts'])) > 0 ) {
						$texts[$defaultLang] = $prevCat['texts'];
					}
					else {
						$texts = $prevCat['texts'];
					}
				}

				$texts[$currentLang] = isset($cat['texts']) ? $cat['texts'] : false;

				return [
					'id'          => $cat['id'],
					'position'    => $cat['position'],
					'mandatory'   => $cat['mandatory'],
					'title'       => $title,
					'description' => $desc,
					'texts'       => $texts,
				];
			}, $settings[self::FIELD_CATEGORIES] );
		}

		return $settings;
	}

	private function get_category_by_id($id) {
		$f = array_filter($this->options[self::FIELD_CATEGORIES], function($c) use ($id) {
			return $c['id'] === $id;
		});

		$f[] = [
			'title' => '',
			'description' => '',
		];

		return array_shift($f);
	}

	/**
	 * Render the option page
	 */
	public function render_option_page() {
		?>
		<div class="wrap">
			<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

			<?php
			if (is_multilingual()) {
				$languageName = get_language_full_name();

				printf( '<p class="description">%s</p>',
					sprintf(
						__('ℹ️ You are currently editing the <b>%s</b> version. The texts configuration need to be translated, but choices & enablings will be set for all languages.', 'cookielawconsent'),
						$languageName
					)
				);
			}
			?>

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

	public function render_simple_text_field($args) {
		$name = isset($args['name'])
			? $args['name']
			: self::SETTINGS_NAME."[{$args['id']}]";

		printf(
			'<input id="%1$s" type="text" name="%2$s" placeholder="%3$s" value="%4$s" />',
			$args['id'],
			$name,
			$args['placeholder'],
			$args['value']
		);
	}

	public function render_texts_field($args, $wrap_in_table = true) {
		$values = ( isset($this->options[$args['id']]) ? get_translated_text( $this->options[$args['id']] ) : [] );

		$fields = array_map(function($field) use ($args, $values) {
			$id    = sprintf( '%s-%s', $args['id'], $field['name'] );
			$name  = sprintf( '%s[%s][%s]', self::SETTINGS_NAME, $args['id'], $field['name'] );
			$value = ( isset($values[$field['name']]) ? $values[$field['name']] : '' );

			$tple = ( (isset($field['type']) && $field['type'] === 'textarea' )
				? '<textarea id="%1$s" name="%3$s" placeholder="%4$s">%5$s</textarea>'
				: '<input id="%1$s" type="text" name="%3$s" placeholder="%4$s" value="%5$s" />'
			);

			return sprintf( '<th><label for="%1$s">%2$s</label></th><td>'.$tple.'</td>',
				$id,
				$field['label'],
				$name,
				$field['placeholder'],
				$value
			);
		}, $args['fields'] );

		$rows = [];
		for ($i=0; $i < (int)ceil(count($fields) / 2); $i++) {
			$rows[] = sprintf('<tr>%s%s</tr>',
				$fields[$i*2],
				(isset($fields[$i*2+1]) ? $fields[$i*2+1] : '')
			);
		}

		$tple = ( $wrap_in_table ? '<table class="form-table texts-table">%s</table>' : '%s' );
		printf( $tple, implode('', $rows) );
	}

	public function render_categories_field() {

		$categories = $this->options[self::FIELD_CATEGORIES];

		?>
		<div class="categories" tabulation data-setting-name="<?php echo self::SETTINGS_NAME; ?>">
			<nav class="categories__nav">
				<div class="categories__tab-list" tab-list>
					<?php /* rendered in javascript */ ?>
				</div>
				<!-- <button class="categories__add">+</button> -->
			</nav>
			<div class="categories__panel-list" panel-list>
				<?php foreach ($categories as $i => $cat) : ?>
					<?php
					if (is_multilingual()) {
						if ( isset($cat['texts']) ) {
							$cat['texts'] = get_translated_text($cat['texts']);
						}
					}
					?>

					<div id="category_<?php echo $cat['id']; ?>" class="category<?php if ($i === 0) echo ' is-active'; ?>" data-idx="<?php echo $i; ?>">
						<input name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][id]" type="hidden" value="<?php echo $cat['id']; ?>"/>
						<table class="form-table">
							<tr class="row">
								<th><label for="<?php echo $cat['id']; ?>-position"><?php _e('Position', 'cookielawconsent'); ?></label></th>
								<td>
									<input id="<?php echo $cat['id']; ?>-position" name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][position]" type="number" min="1" step="1" value="<?php echo $cat['position']; ?>"/>
								</td>
							</tr>
							<tr class="row">
								<th><label for="<?php echo $cat['id']; ?>-mandatory"><?php _e('Mandatory?', 'cookielawconsent'); ?></label></th>
								<td>
									<div class="switch">
										<input id="<?php echo $cat['id']; ?>-mandatory" name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][mandatory]" type="checkbox" class="switch__chk" <?php if ($cat['mandatory']) echo 'checked'; ?>/>
										<label for="<?php echo $cat['id']; ?>-mandatory" class="switch__label"><?php _e('Mandatory?', 'cookielawconsent'); ?></label>
									</div>
								</td>
							</tr>
							<tr class="row">
								<th><label for="<?php echo $cat['id']; ?>-title">Title</label></th>
								<td>
									<input id="<?php echo $cat['id']; ?>-title" name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][title]" type="text" value="<?php echo get_translated_text($cat['title']); ?>" class="category__title"/>
								</td>
							</tr>
							<tr class="row">
								<th><label for="<?php echo $cat['id']; ?>-description"><?php _e('Description', 'cookielawconsent'); ?></label></th>
								<td>
									<textarea id="<?php echo $cat['id']; ?>-description" name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][description]" ><?php echo get_translated_text($cat['description']); ?></textarea>
								</td>
							</tr>
							<tr class="row">
								<th><h3><?php _e( 'Custom Texts', 'cookielawconsent'); ?></h3></th>
							</tr>
							<tr>
								<th><label for="<?php echo $cat['id']; ?>-texts-enable"><?php _e('Enable', 'cookielawconsent'); ?></label></th>
								<td>
									<input
										id="<?php echo $cat['id']; ?>-texts-enable"
										type="text"
										name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][texts][enable]"
										placeholder="<?php _e( 'Enable cookies', 'cookielawconsent' ); ?>"
										value="<?php if (isset($cat['texts']['enable'])) echo $cat['texts']['enable']; ?>"
									/>
								</td>
								<th><label for="<?php echo $cat['id']; ?>-texts-enabled"><?php _e('Enabled', 'cookielawconsent'); ?></label></th>
								<td>
									<input
										id="<?php echo $cat['id']; ?>-texts-enabled"
										type="text"
										name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][texts][enabled]"
										placeholder="<?php _e( 'Enabled', 'cookielawconsent' ); ?>"
										value="<?php if (isset($cat['texts']['enabled'])) echo $cat['texts']['enabled']; ?>"
									/>
								</td>
							</tr>
							<tr>
								<th><label for="<?php echo $cat['id']; ?>-texts-disable"><?php _e('Disable', 'cookielawconsent'); ?></label></th>
								<td>
									<input
										id="<?php echo $cat['id']; ?>-texts-disable"
										type="text"
										name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][texts][disable]"
										placeholder="<?php _e( 'Disable cookies', 'cookielawconsent' ); ?>"
										value="<?php if (isset($cat['texts']['disable'])) echo $cat['texts']['disable']; ?>"
									/>
								</td>
								<th><label for="<?php echo $cat['id']; ?>-texts-disabled"><?php _e('Disabled', 'cookielawconsent'); ?></label></th>
								<td>
									<input
										id="<?php echo $cat['id']; ?>-texts-disabled"
										type="text"
										name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][texts][disabled]"
										placeholder="<?php _e( 'Disabled', 'cookielawconsent' ); ?>"
										value="<?php if (isset($cat['texts']['disabled'])) echo $cat['texts']['disabled']; ?>"
									/>
								</td>
							</tr>
							<tr>
								<th><label for="<?php echo $cat['id']; ?>-texts-alwaysEnabled"><?php _e('Always Enabled <br><small><em>Mandatory category</em></small>', 'cookielawconsent'); ?></label></th>
								<td>
									<input
										id="<?php echo $cat['id']; ?>-texts-alwaysEnabled"
										type="text"
										name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][texts][alwaysEnabled]"
										placeholder="<?php _e( 'Always enabled', 'cookielawconsent' ); ?>"
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
			$categoriesOptions[$cat['id']] = get_translated_text($cat['title']);
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
								<th><label for="<?php echo "service-enabled-{$srv['name']}"; ?>"><?php _e('Enable?', 'cookielawconsent'); ?></label></th>
								<td >
									<?php $this->render_switch_field([
										'id'      => "service-enabled-{$srv['name']}",
										'name'    => self::SETTINGS_NAME ."[services][{$srv['name']}][enabled]",
										'checked' => $srv['enabled'],
									]); ?>
								</td>
							</tr>
							<tr class="row">
								<th><label for="<?php echo "service-category-{$srv['name']}"; ?>"><?php _e('Category', 'cookielawconsent'); ?></label></th>
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
