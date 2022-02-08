<?php
namespace CookieLawConsent;

const SERVICES = [
	[
		'name'     => 'googletagmanager',
		'title'    => 'Google Tag Manager',
		'info'     => 'Google Tag Manager (also known as GTM) is a free tag management solution provided by Google. Before to activate it, create an account and a "container" at <a href="https://tagmanager.google.com" target="_blank">tagmanager.google.com</a>',
		'enabled'  => false,
		'category' => null,
		'fields'   => [
			[ 'type' => 'text', 'name' => 'containerID', 'label' => 'Container ID', 'placeholder' => 'GTM-XXX'],
		]
	],
	[
		'name'     => 'googleanalytics',
		'title'    => 'Google Analytics',
		'info'     => 'How to find your tracking ID <a href="https://support.google.com/analytics/answer/1008080" target="_blank">Set up Analytics tracking</a>',
		'enabled'  => false,
		'category' => null,
		'fields'   => [
			[ 'type' => 'text', 'name' => 'trackingID', 'label' => 'Tracking ID', 'placeholder' => 'UA-XXXXX-Y'],
			[ 'type' => 'switch', 'name' => 'anonymizeIp', 'label' => 'Anonymize IP ?', 'default' => true ],
		]
	],
	[
		'name'     => 'facebookpixel',
		'title'    => 'Facebook Pixel',
		'info'     => '',
		'enabled'  => false,
		'category' => null,
		'fields'   => [
			[ 'type' => 'text', 'name' => 'pixelID', 'label' => 'Pixel ID', 'placeholder' => '1234567890'],
		]
	],
	[
		'name'     => 'recaptcha',
		'title'    => 'Google ReCAPTCHA',
		'info'     => 'Protect your website from spam and abuse while allowing real people to easily submit forms<br>Register and get your Site and Secret keys at <a href="https://www.google.com/recaptcha/admin" target="_blank">Google reCAPTCHA console</a>',
		'enabled'  => false,
		'category' => null,
		'fields'   => [
			[ 'type' => 'text', 'name' => 'siteKey', 'label' => 'Site Key', 'placeholder' => 'QXJkAglvNXLW9seVzvQK'],
			[ 'type' => 'text', 'name' => 'secretKey', 'label' => 'Secret Key', 'placeholder' => 'eqVpZdSLlGIRuBSx4QVs'],
		]
	],
	[
		'name'     => 'googlemaps',
		'title'    => 'Google Maps',
		'info'     => '',
		'enabled'  => false,
		'category' => null,
		'fields'   => [
			[ 'type' => 'text', 'name' => 'apiKey', 'label' => 'API Key', 'placeholder' => 'ABzaSyCP7ENwERjmhUGE1E2ch9CRTL51VKYUyCD'],
		]
	],

];
