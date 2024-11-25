import CookieLaw from "./assets/cookie-law";

const config = clc_config ?? {};

if (typeof config.categories === "object")
	config.categories = Object.keys(config.categories).map(
		(key) => config.categories[key]
	);

new CookieLaw(config);
