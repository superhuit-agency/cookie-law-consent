<?php

namespace CookieLawConsent\Frontend;

use CookieLawConsent\Admin\SettingsPage;

use function CookieLawConsent\is_multilingual;
use function CookieLawConsent\get_translated_text;

/**
 * ACTIONS & FILTERS
 * =================
 *
 * Register the actions & filters
 */
add_action( 'init', __NAMESPACE__.'\register_assets');
add_action( 'wp_enqueue_scripts', __NAMESPACE__.'\enqueue_assets', 5);
add_filter( 'clc_config', __NAMESPACE__.'\filter_recaptcha_config', 5);

function register_assets() {
	$manifest_path = CLC_PLUGIN_PATH.'dist/manifest.json';
	if ( !file_exists($manifest_path) ) return;
	$manifest = json_decode(file_get_contents($manifest_path, true));

	wp_register_style(
		'cookie-law-consent-style',
		CLC_PLUGIN_URL.'dist/'.$manifest->{'cookie-law-consent.css'},
		null,
		null
	);
	wp_register_script(
		'cookie-law-consent-js',
		CLC_PLUGIN_URL.'dist/'.$manifest->{'cookie-law-consent.js'},
		null,
		null,
		false
	);
}

function enqueue_assets() {
	$config = get_option( SettingsPage::SETTINGS_NAME );

	// Bail early as no services is configured
	if ( !(isset($config[SettingsPage::FIELD_SERVICES]) && count($config[SettingsPage::FIELD_SERVICES]) > 0) ) return;

	$config['texts'] = [
		'banner' => get_banner_texts(get_translated_text($config[SettingsPage::FIELD_BANNER_TEXTS])),
		'modal' => get_modal_texts(get_translated_text($config[SettingsPage::FIELD_MODAL_TEXTS])),
	];

	$config[SettingsPage::FIELD_CATEGORIES] = array_map(function($cat) {
		$cat['title'] = get_translated_text($cat['title'] ?? '');
		$cat['description'] = get_translated_text($cat['description'] ?? '');
		$cat['texts'] = get_category_texts(get_translated_text($cat['texts'] ?? ''));

		return $cat;
	}, $config[SettingsPage::FIELD_CATEGORIES]);

	foreach ($config[SettingsPage::FIELD_CATEGORIES] as $i => $cat) {
		$services = array_filter(
			$config[SettingsPage::FIELD_SERVICES],
			function($srv) use ($cat){
				return ( isset($srv['category']) && $srv['category'] === $cat['id'] );
			}
		);

		foreach ($services as $name => $service) {
			$service['name'] = $name;
			unset($service['enabled']);
			unset($service['category']);
			$config['categories'][$i][SettingsPage::FIELD_SERVICES][] = $service;
		}
	}

	unset($config[SettingsPage::FIELD_SERVICES]);
	unset($config[SettingsPage::FIELD_BANNER_TEXTS]);
	unset($config[SettingsPage::FIELD_MODAL_TEXTS]);

	$config = add_stats_config( $config );

	/**
	 * Filters the config array
	 *
	 * @param array $config the config array
	 */
	$config = apply_filters( 'clc_config', $config );

	// Enqueue the style
	wp_enqueue_style( 'cookie-law-consent-style');

	// Localize & enqueue the script
	wp_localize_script( 'cookie-law-consent-js', 'clc_config', $config);
	wp_enqueue_script( 'cookie-law-consent-js' );
}

/**
 * Add the consent statistics settings to the config when
 * wp-cookie-consent-analytics is active, so the banner events are sent to it.
 * Without it, the config is returned unchanged.
 *
 * @param array $config the config array
 *
 * @return array the config array, with `stats_endpoint`, `stats_sample_rate`
 *               and `stats_version` when statistics are enabled
 */
function add_stats_config( $config ) {
	if ( ! defined( 'COOKIE_ANALYTICS_VERSION' ) ) return $config;

	/**
	 * Filters the URL the banner events are sent to
	 *
	 * @param string|false $endpoint the endpoint URL, false disables the statistics
	 */
	$endpoint = apply_filters( 'clc_stats_endpoint', rest_url( 'supt/v1/cookie-stats' ) );
	if ( empty( $endpoint ) || ! is_string( $endpoint ) ) return $config;

	/**
	 * Filters the share of browser sessions whose banner events are sent
	 *
	 * @param float $sample_rate between 0 (none) and 1 (all, default)
	 */
	$sample_rate = apply_filters( 'clc_stats_sample_rate', 1 );
	$sample_rate = is_numeric( $sample_rate ) ? min( 1, max( 0, (float) $sample_rate ) ) : 1;

	$config['stats_endpoint']    = $endpoint;
	$config['stats_sample_rate'] = $sample_rate;
	$config['stats_version']     = COOKIE_ANALYTICS_VERSION;

	return $config;
}

function get_category_texts( $texts = [] ) : Array {
	return array_merge( SettingsPage::default_texts( SettingsPage::category_text_fields() ), (is_array($texts) ? $texts : []) );
}
function get_banner_texts( $texts = [] ) : Array {
	return array_merge( SettingsPage::default_texts( SettingsPage::banner_text_fields() ), (is_array($texts) ? $texts : []) );
}
function get_modal_texts( $texts = [] ) : Array {
	return array_merge( SettingsPage::default_texts( SettingsPage::modal_text_fields() ), (is_array($texts) ? $texts : []) );
}

/**
 * Filter ReCaptcha config to remove the secret key from FE.
 * Avoid leaking the secret key in the JS.
 *
 * @param array $config the config array
 *
 * @return array the filtered config array
 */
function filter_recaptcha_config( $config ) {
	foreach ($config['categories'] as $cat_id => $cat) {
		foreach ($cat['services'] ?? [] as $srv_id => $srv) {
			if ($srv['name'] === 'recaptcha') {
				unset( $config['categories'][$cat_id]['services'][$srv_id]['secretKey'] );
			}
		}
	}

	return $config;
}
