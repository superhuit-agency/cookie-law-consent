<?php

use CookieLawConsent\Admin\SettingsPage;

function cookielawconsent_get_service( $name ) {

	$config = get_option( SettingsPage::SETTINGS_NAME );
	$services = $config[SettingsPage::FIELD_SERVICES] ?? null;

	$service_config = array_merge(
		[ 'enabled' => false ],
		$services[$name] ?? []
	);

	$service_config['enabled'] = ($service_config['enabled'] === 'on');

	return $service_config;
}
