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
add_action( 'wp_enqueue_scripts', __NAMESPACE__.'\enqueue_assets');

function enqueue_assets() {
	$config = get_option( SettingsPage::SETTINGS_NAME );

	// Bail early as no services is configured
	if ( count($config[SettingsPage::FIELD_SERVICES]) === 0 ) return;

	if (!$config[SettingsPage::FIELD_EXTERNAL_STYLES]) {
		wp_enqueue_style( 'cookie-law-consent-styles', plugins_url( '../build/cookie-law-consent.css', __FILE__ ), CLC_PLUGIN_VERSION );
	}

	if ( is_multilingual() ) {
		$config[SettingsPage::FIELD_CATEGORIES] = array_map(function($cat) {
			$cat['title'] = get_translated_text($cat['title']);
			$cat['description'] = get_translated_text($cat['description']);
			$cat['texts'] = get_category_texts(get_translated_text($cat['texts']));

			return $cat;
		}, $config[SettingsPage::FIELD_CATEGORIES]);
	}

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
	unset($config[SettingsPage::FIELD_EXTERNAL_STYLES]);

	wp_register_script( 'cookie-law-consent-js', plugins_url( '../build/cookie-law-consent.js', __FILE__ ), null, CLC_PLUGIN_VERSION, true );
	wp_localize_script( 'cookie-law-consent-js', 'clc_config', json_encode($config));
	wp_enqueue_script( 'cookie-law-consent-js' );
}

function get_category_texts( $texts = [] ) : Array {
	return array_merge( [
		'enable' => __( 'Enable cookies', 'cookie-law-consent' ),
		'enabled' => __( 'Enabled', 'cookie-law-consent' ),
		'disable' => __( 'Disable cookies', 'cookie-law-consent' ),
		'disabled' => __( 'Disabled', 'cookie-law-consent' ),
		'alwaysEnabled' => __( 'Always enabled', 'cookie-law-consent' ),
	], (is_array($texts) ? $texts : []) );
}
