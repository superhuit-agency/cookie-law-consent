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

	const FIELD_BANNER_POSITION = 'banner_position';
	const FIELD_BANNER_TEXTS = 'banner_texts';
	const FIELD_MODAL_TEXTS = 'modal_texts';
	const FIELD_CATEGORIES = 'categories';
	const FIELD_SERVICES = 'services';

	/**
	 * Holds the values to be used in the fields callbacks
	 */
	private $options;

	/**
	 * The last value returned by sanitize()
	 */
	private $sanitized;

	/**
	 * Start up
	 */
	public function __construct() {
		add_action( 'admin_menu', [$this, 'add_plugin_page'] );
		add_action( 'admin_enqueue_scripts', [$this, 'enqueue_assets'] );

		add_action( 'admin_init', [$this, 'regsiter_settings_fields'] );
	}

	public static function insert_default_settings() {
		$default = [];
		$default[self::FIELD_BANNER_POSITION] = 'bottom-right';
		// Same shape as the saved settings form, so the defaults are stored the same
		// whether or not `sanitize()` runs on them.
		$default[self::FIELD_BANNER_TEXTS] = [];
		$default[self::FIELD_MODAL_TEXTS] = [];
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
		$default[self::FIELD_SERVICES] = [];

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

		$manifest_path = CLC_PLUGIN_PATH.'dist/manifest.json';
		if ( !file_exists($manifest_path) ) return;
		$manifest = json_decode(file_get_contents($manifest_path, true));

		wp_enqueue_style(
			'cookie_law_consent-admin-styles',
			CLC_PLUGIN_URL.'dist/'.$manifest->{'cookie-law-consent-admin.css'},
			null,
			null
		);
		wp_enqueue_script(
			'cookie_law_consent-admin-js',
			CLC_PLUGIN_URL.'dist/'.$manifest->{'cookie-law-consent-admin.js'},
			null,
			null,
			true
		);
	}

	/**
	 * The custom texts of the banner, the modal and each category, in settings form order.
	 * The only list of their names: the settings form renders these fields, `sanitize()` uses
	 * the names to tell flat texts from texts keyed by language, and the front end shows
	 * the placeholders when a text is empty.
	 *
	 * @return array[] Each with `name`, `label`, `placeholder` and optionally `type`
	 */
	public static function banner_text_fields() {
		return [
			[ 'name' => 'title', 'label' => _x('Title', 'Banner text', 'cookielawconsent'), 'placeholder' => _x('Cookies', 'Banner Title', 'cookielawconsent' ) ],
			[ 'name' => 'personalize', 'label' => _x('Personalize link', 'Banner text', 'cookielawconsent'), 'placeholder' => _x('Personalize', 'Banner Personalize', 'cookielawconsent' ) ],
			[ 'name' => 'message', 'type' => 'textarea', 'label' => _x('Description', 'Banner text', 'cookielawconsent'), 'placeholder' => _x('This site uses cookies to help improve your user experience and gives you control over what you want to activate.', 'Banner Message', 'cookielawconsent' ) ],
			[ 'name' => 'acceptAll', 'label' => _x('Accept all button', 'Banner text', 'cookielawconsent'), 'placeholder' => _x('Ok, accept all', 'Banner Accept All', 'cookielawconsent' ) ],
			[ 'name' => 'denyAll', 'label' => _x('Deny all button', 'Banner text', 'cookielawconsent'), 'placeholder' => _x('Deny all', 'Banner Deny All', 'cookielawconsent' ) ],
		];
	}

	/** @see banner_text_fields() */
	public static function modal_text_fields() {
		return [
			[ 'name' => 'title', 'label' => _x('Title', 'Modal text', 'cookielawconsent'), 'placeholder' => _x('Privacy Overview', 'Modal Title', 'cookielawconsent' ) ],
			[ 'name' => 'close', 'label' => _x('Close button', 'Modal text', 'cookielawconsent'), 'placeholder' => _x('Close', 'Modal Personalize', 'cookielawconsent' ) ],
			[ 'name' => 'description', 'type' => 'textarea', 'label' => _x('Description', 'Modal text', 'cookielawconsent'), 'placeholder' => _x('This website uses cookies to improve your experience while you navigate through the website. Out of these cookies, the cookies that are categorized as necessary are stored on your browser as they are essential for the working of basic functionalities of the website. We also use third-party cookies that help us analyze and understand how you use this website. These cookies will be stored in your browser only with your consent. You also have the option to opt-out of these cookies. But opting out of some of these cookies may have an effect on your browsing experience.', 'Modal Description', 'cookielawconsent' ) ],
			[ 'name' => 'save', 'label' => _x('Save button', 'Modal text', 'cookielawconsent'), 'placeholder' => _x('Save & Accept', 'Modal Accept All', 'cookielawconsent' ) ],
		];
	}

	/** @see banner_text_fields() */
	public static function category_text_fields() {
		return [
			[ 'name' => 'enable', 'label' => __('Enable', 'cookielawconsent'), 'placeholder' => __( 'Enable cookies', 'cookielawconsent' ) ],
			[ 'name' => 'enabled', 'label' => __('Enabled', 'cookielawconsent'), 'placeholder' => __( 'Enabled', 'cookielawconsent' ) ],
			[ 'name' => 'disable', 'label' => __('Disable', 'cookielawconsent'), 'placeholder' => __( 'Disable cookies', 'cookielawconsent' ) ],
			[ 'name' => 'disabled', 'label' => __('Disabled', 'cookielawconsent'), 'placeholder' => __( 'Disabled', 'cookielawconsent' ) ],
			[ 'name' => 'alwaysEnabled', 'label' => __('Always Enabled <br><small><em>Mandatory category</em></small>', 'cookielawconsent'), 'placeholder' => __( 'Always enabled', 'cookielawconsent' ) ],
		];
	}

	/**
	 * @param array $fields One of the `*_text_fields()`
	 * @return string[] The text names
	 */
	public static function text_names( Array $fields ) {
		return array_column( $fields, 'name' );
	}

	/**
	 * @param array $fields One of the `*_text_fields()`
	 * @return array The default texts, keyed by text name
	 */
	public static function default_texts( Array $fields ) {
		return array_column( $fields, 'placeholder', 'name' );
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
			function() {
				echo '<em>'.__('If you wish to completely overide the style, you can enqueue your own style file with the following snippet', 'cookielawconsent').'</em>';
				echo '<div><code>' .
				 "add_action( 'init', function() {<br>".
					"\tif (! wp_style_is('cookie-law-consent-style', 'registered') ) return;<br>" .
					"\twp_deregister_style( 'cookie-law-consent-style' );<br>" .
					"\twp_register_style( 'cookie-law-consent-style', 'path/to/your/theme/cookie-law-consent.css' );<br>" .
				"}, 20);" .
				'</code></div>';
			},
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
					'full-bottom'  => _x( '↔ Bottom full width', 'Option page select', 'cookielawconsent' ),
				],
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
				'fields'    => self::banner_text_fields(),
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
				'fields'    => self::modal_text_fields(),
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
	 * Cast a switch value to a boolean.
	 * Handles a checkbox's submitted "on" as well as already stored booleans.
	 *
	 * @param mixed $value
	 * @return bool
	 */
	private static function to_bool( $value ) {
		return filter_var( $value, FILTER_VALIDATE_BOOLEAN );
	}

	/**
	 * Treat a missing (null) or non-array value as an empty collection.
	 *
	 * @param mixed $value
	 * @return array
	 */
	private static function to_array( $value ) {
		return is_array( $value ) ? $value : [];
	}

	/**
	 * Whether texts are flat (keyed by text name, as saved without WPML/Polylang)
	 * rather than keyed by language. Language codes never match a text name.
	 *
	 * @param array $texts
	 * @param array $textNames The `text_names()` of one of the `*_text_fields()`
	 * @return bool
	 */
	private static function has_flat_texts( Array $texts, Array $textNames ) {
		return count( array_intersect_key( $texts, array_flip( $textNames ) ) ) > 0;
	}

	/**
	 * Previously stored texts keyed by language: flat texts move under the default language.
	 * Language keys stored next to flat texts are kept, and win over them for the default language.
	 *
	 * @param mixed  $texts
	 * @param array  $textNames The `text_names()` of one of the `*_text_fields()`
	 * @param string $defaultLang
	 * @return array
	 */
	private static function texts_by_lang( $texts, Array $textNames, $defaultLang ) {
		$texts = self::to_array( $texts );
		if ( !self::has_flat_texts( $texts, $textNames ) ) return $texts;

		$names = array_flip( $textNames );
		$byLang = array_diff_key( $texts, $names );
		if ( !isset( $byLang[$defaultLang] ) ) $byLang[$defaultLang] = array_intersect_key( $texts, $names );

		return $byLang;
	}

	/**
	 * Escape a stored value for an HTML attribute or element text, so that the browser
	 * shows (and the form submits back) exactly the stored value.
	 * Unlike `esc_attr()` / `esc_html()`, entities already in the value are encoded again,
	 * as `esc_textarea()` does: a value stored as `R&amp;D` is shown as `R&amp;D`, instead of
	 * being decoded to `R&D` and saved as such on the next save.
	 *
	 * @param mixed $value
	 * @return string
	 */
	private static function esc_value( $value ) {
		return htmlspecialchars( (string) $value, ENT_QUOTES, get_option( 'blog_charset' ), true );
	}

	/**
	 * Sanitize each setting field as needed
	 *
	 * @param array $input Contains all settings fields as array keys
	 */
	public function sanitize( $fields ) {

		// Besides the settings form POST, this runs on the default settings (`add_option()` on activation)
		// and on its own output (code writing the stored value back), so any key may be missing:
		// missing collections are treated as empty.
		if ( !is_array($fields) ) $fields = [];

		// `update_option()` on a missing option sanitizes, then passes the result to `add_option()`,
		// which sanitizes it again: return it as is, as on a multilingual site a second pass would
		// merge the texts into the per-language structure once more.
		if ( isset($this->sanitized) && $fields === $this->sanitized ) return $fields;

		$settings = [];

		if( isset( $fields[self::FIELD_BANNER_POSITION] ) ) {
			$settings[self::FIELD_BANNER_POSITION] = sanitize_text_field( $fields[self::FIELD_BANNER_POSITION] );
		}


		$settings[self::FIELD_BANNER_TEXTS] = array_filter( self::to_array($fields[self::FIELD_BANNER_TEXTS] ?? null) );
		$settings[self::FIELD_MODAL_TEXTS] = array_filter( self::to_array($fields[self::FIELD_MODAL_TEXTS] ?? null) );

		$settings[self::FIELD_CATEGORIES] = array_values(array_map(
			function(Array $cat) {
				// The form posts the checkbox as "on" when checked and omits it otherwise,
				// while stored settings hold a boolean: `false` must stay `false`.
				$cat['mandatory'] = self::to_bool( $cat['mandatory'] ?? false );
				$cat['position'] = (int)($cat['position'] ?? 0);
				// Empty texts are removed below, so they may be missing on a later pass.
				$cat['texts'] = array_filter( self::to_array($cat['texts'] ?? null) );
				if (count($cat['texts']) === 0 ) unset($cat['texts']);

				return $cat;
			},
			array_filter(
				self::to_array($fields[self::FIELD_CATEGORIES] ?? null),
				function($cat) {
					return is_array($cat) && !empty($cat['title']);
				}
			)
		));

		usort($settings[self::FIELD_CATEGORIES], function($a, $b) {
			return $a['position'] - $b['position'];
		});

		$settings[self::FIELD_SERVICES] = array_filter(
			self::to_array($fields[self::FIELD_SERVICES] ?? null),
			function($srv) {
				return is_array($srv) && isset($srv['enabled']);
			}
		);

		foreach (SERVICES as $srvDef) {
			if ( !isset($settings[self::FIELD_SERVICES][$srvDef['name']]) ) continue;

			foreach ($srvDef['fields'] as $fld) {
				if ( $fld['type'] === 'switch' ) {
					// Store `switch` fields as explicit booleans: an unchecked checkbox is not submitted,
					// so without this an "off" switch would be absent and the front-end default would apply.
					$settings[self::FIELD_SERVICES][$srvDef['name']][$fld['name']] = self::to_bool(
						$settings[self::FIELD_SERVICES][$srvDef['name']][$fld['name']] ?? false
					);
				}
				else if ( isset($settings[self::FIELD_SERVICES][$srvDef['name']][$fld['name']]) ) {
					$settings[self::FIELD_SERVICES][$srvDef['name']][$fld['name']] = sanitize_text_field(
						$settings[self::FIELD_SERVICES][$srvDef['name']][$fld['name']]
					);
				}
			}
		}

		if (is_multilingual()) {
			$currentLang = get_current_lang();
			$defaultLang = get_default_lang();

			// No stored option yet (`get_option()` returned false): no previous values to merge with.
			$prevOptions = self::to_array($this->options);

			$bannerTexts = self::texts_by_lang( $prevOptions[self::FIELD_BANNER_TEXTS] ?? null, self::text_names( self::banner_text_fields() ), $defaultLang );
			$bannerTexts[$currentLang] = $settings[self::FIELD_BANNER_TEXTS];
			$settings[self::FIELD_BANNER_TEXTS] = $bannerTexts;

			$modalTexts = self::texts_by_lang( $prevOptions[self::FIELD_MODAL_TEXTS] ?? null, self::text_names( self::modal_text_fields() ), $defaultLang );
			$modalTexts[$currentLang] = $settings[self::FIELD_MODAL_TEXTS];
			$settings[self::FIELD_MODAL_TEXTS] = $modalTexts;


			$categoryTextNames = self::text_names( self::category_text_fields() );
			$settings[self::FIELD_CATEGORIES] = array_map(function($cat) use ($currentLang, $defaultLang, $categoryTextNames) {
				$prevCat = $this->get_category_by_id($cat['id'] ?? null);

				if (is_array($prevCat['title'] ?? null)) $title = $prevCat['title'];
				else {
					$title = [];
					$title[$defaultLang] = $prevCat['title'] ?? '';
				}
				$title[$currentLang] = $cat['title'];


				if (is_array($prevCat['description'] ?? null))  $desc = $prevCat['description'];
				else {
					$desc = [];
					$desc[$defaultLang] = $prevCat['description'] ?? '';
				}
				$desc[$currentLang] = $cat['description'] ?? '';

				$texts = self::texts_by_lang( $prevCat['texts'] ?? null, $categoryTextNames, $defaultLang );
				$texts[$currentLang] = isset($cat['texts']) ? $cat['texts'] : false;

				return [
					'id'          => $cat['id'] ?? null,
					'position'    => $cat['position'],
					'mandatory'   => $cat['mandatory'],
					'title'       => $title,
					'description' => $desc,
					'texts'       => $texts,
				];
			}, $settings[self::FIELD_CATEGORIES] );
		}

		$this->sanitized = $settings;

		return $settings;
	}

	private function get_category_by_id($id) {
		$categories = self::to_array( self::to_array($this->options)[self::FIELD_CATEGORIES] ?? null );

		$f = array_filter($categories, function($c) use ($id) {
			return is_array($c) && isset($c['id']) && $c['id'] === $id;
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
						// translators: %s is the language name
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
				self::esc_value( $value ),
				self::esc_value( $label )
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

	public function render_texts_field($args, $wrap_in_table = true) {
		$values = ( isset($this->options[$args['id']]) ? get_translated_text( $this->options[$args['id']] ) : [] );

		$fields = array_map(function($field) use ($args, $values) {
			$id    = sprintf( '%s-%s', $args['id'], $field['name'] );
			$name  = sprintf( '%s[%s][%s]', self::SETTINGS_NAME, $args['id'], $field['name'] );
			$value = ( isset($values[$field['name']]) ? $values[$field['name']] : '' );

			if ( isset($field['type']) && $field['type'] === 'textarea' ) {
				$tple  = '<textarea id="%1$s" name="%3$s" placeholder="%4$s">%5$s</textarea>';
				$value = esc_textarea( $value );
			}
			else {
				$tple  = '<input id="%1$s" type="text" name="%3$s" placeholder="%4$s" value="%5$s" />';
				$value = self::esc_value( $value );
			}

			return sprintf( '<th><label for="%1$s">%2$s</label></th><td>'.$tple.'</td>',
				$id,
				$field['label'],
				$name,
				$field['placeholder'],
				$value
			);
		}, $args['fields'] );

		$rows = [];
		for ($i=0; $i < (int)(ceil(count($fields) / 2)); $i++) {
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
				<button class="categories__add">+</button>
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

					<div id="category_<?php echo self::esc_value( $cat['id'] ); ?>" class="category<?php if ($i === 0) echo ' is-active'; ?>" data-idx="<?php echo $i; ?>">
						<input name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][id]" type="hidden" value="<?php echo self::esc_value( $cat['id'] ); ?>"/>
						<table class="form-table">
							<tr class="row">
								<th><label for="<?php echo self::esc_value( $cat['id'] ); ?>-position"><?php _e('Position', 'cookielawconsent'); ?></label></th>
								<td>
									<input id="<?php echo self::esc_value( $cat['id'] ); ?>-position" name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][position]" type="number" min="1" step="1" value="<?php echo self::esc_value( $cat['position'] ); ?>"/>
								</td>
							</tr>
							<tr class="row">
								<th><label for="<?php echo self::esc_value( $cat['id'] ); ?>-mandatory"><?php _e('Mandatory?', 'cookielawconsent'); ?></label></th>
								<td>
									<div class="switch">
										<input id="<?php echo self::esc_value( $cat['id'] ); ?>-mandatory" name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][mandatory]" type="checkbox" class="switch__chk" <?php if ($cat['mandatory']) echo 'checked'; ?>/>
										<label for="<?php echo self::esc_value( $cat['id'] ); ?>-mandatory" class="switch__label"><?php _e('Mandatory?', 'cookielawconsent'); ?></label>
									</div>
								</td>
							</tr>
							<tr class="row">
								<th><label for="<?php echo self::esc_value( $cat['id'] ); ?>-title">Title</label></th>
								<td>
									<input id="<?php echo self::esc_value( $cat['id'] ); ?>-title" name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][title]" type="text" value="<?php echo self::esc_value( get_translated_text($cat['title']) ); ?>" class="category__title"/>
								</td>
							</tr>
							<tr class="row">
								<th><label for="<?php echo self::esc_value( $cat['id'] ); ?>-description"><?php _e('Description', 'cookielawconsent'); ?></label></th>
								<td>
									<textarea id="<?php echo self::esc_value( $cat['id'] ); ?>-description" name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][description]" ><?php echo esc_textarea( get_translated_text($cat['description']) ); ?></textarea>
								</td>
							</tr>
							<tr class="row">
								<th><h3><?php _e( 'Custom Texts', 'cookielawconsent'); ?></h3></th>
							</tr>
<?php foreach ( array_chunk( self::category_text_fields(), 2 ) as $row ) : ?>
							<tr>
<?php foreach ( $row as $field ) : ?>
								<th><label for="<?php echo self::esc_value( $cat['id'] ); ?>-texts-<?php echo $field['name']; ?>"><?php echo $field['label']; ?></label></th>
								<td>
									<input
										id="<?php echo self::esc_value( $cat['id'] ); ?>-texts-<?php echo $field['name']; ?>"
										type="text"
										name="<?php echo self::SETTINGS_NAME; ?>[categories][<?php echo $i; ?>][texts][<?php echo $field['name']; ?>]"
										placeholder="<?php echo $field['placeholder']; ?>"
										value="<?php if (isset($cat['texts'][$field['name']])) echo self::esc_value( $cat['texts'][$field['name']] ); ?>"
									/>
								</td>
<?php endforeach ?>
							</tr>
<?php endforeach ?>
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
									// A switch saved before values were stored as booleans may be absent:
									// show the default, which is what the front-end applies in that case.
									? ( array_key_exists($fld['name'], $data) ? self::to_bool($data[$fld['name']]) : !empty($fld['default']) )
									// A field added to the service after it was saved may be absent:
									// keep the definition's default value (or none, rendered empty).
									: ( array_key_exists($fld['name'], $data) ? $data[$fld['name']] : ($fld['value'] ?? null) )
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
												echo '<input id="'. $field['name'] .'" name="'. $name .'" type="'. $field['type'] .'" value="'. self::esc_value( $value ) .'" placeholder="'. $field['placeholder'] .'"/>';
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
