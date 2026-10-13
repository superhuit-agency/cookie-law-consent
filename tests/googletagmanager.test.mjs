/**
 * Google Tag Manager service: order of the Consent Mode commands and events
 * in the dataLayer, driven through the real CookieLaw consent logic.
 */
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

// Minimal browser globals: a cookie jar is all the consent logic needs
const jar = new Map();
globalThis.window = globalThis;
globalThis.document = {
	get cookie() {
		return [...jar].map(([name, value]) => `${name}=${value}`).join("; ");
	},
	set cookie(str) {
		const [pair] = str.split(";");
		const eq = pair.indexOf("=");
		jar.set(pair.slice(0, eq), pair.slice(eq + 1));
	},
};

const { default: CookieLaw } = await import("../src/public/assets/cookie-law.js");
const { default: DEFAULT_CONFIG } = await import(
	"../src/public/assets/default-config.json"
);
const { default: createConsentStats } = await import(
	"../src/public/assets/utils/stats.js"
);

const CONTAINER = "GTM-TEST";
const COOKIE = `${DEFAULT_CONFIG.cookieName}_analytics_accepted`;

let scriptCallbacks;

/**
 * A CookieLaw instance without its banner/modal DOM: the consent logic
 * (getCategoriesSettings, acceptAll, denyAll, ...) is the real one.
 * Script injections are recorded in the dataLayer as `script` entries.
 */
function createCookieLaw({ mandatory = false } = {}) {
	const clc = Object.create(CookieLaw.prototype);
	clc.config = {
		...DEFAULT_CONFIG,
		categories: [
			{
				id: "analytics",
				mandatory,
				services: [{ name: "googletagmanager", containerID: CONTAINER }],
			},
		],
	};
	clc.state = { bannerDismissed: false, acceptedServices: [], initedServices: [] };
	clc.stats = createConsentStats(clc.config);
	clc.refs = {
		banner: { show() {}, hide() {} },
		modal: { setCategoryEnabled() {} },
	};
	clc.addScript = (url, callback) => {
		window.dataLayer.push({ script: url });
		if (typeof callback === "function") scriptCallbacks.push(callback);
	};
	return clc;
}

/** Page load: what the constructor does through initRefs() */
function loadPage(options) {
	const clc = createCookieLaw(options);
	clc.getCategoriesSettings();
	return clc;
}

/** The script finished loading */
function scriptsLoaded() {
	scriptCallbacks.splice(0).forEach((cb) => cb());
}

/** dataLayer as short labels, e.g. "consent update granted", "event gtm.js" */
function timeline() {
	return window.dataLayer.map((item) => {
		if (item.script) return "script";
		if (item.event) return `event ${item.event}`;
		const [cmd, type, params] = Array.from(item);
		if (type === "update")
			return `${cmd} ${type} ${params.analytics_storage}`;
		return `${cmd} ${type}`;
	});
}

const count = (label) => timeline().filter((l) => l === label).length;

beforeEach(() => {
	jar.clear();
	window.dataLayer = [];
	scriptCallbacks = [];
});

test("first visit: consent default (denied, wait_for_update) is pushed before gtm.js, then GTM is injected", () => {
	loadPage();

	assert.deepEqual(timeline(), ["consent default", "event gtm.js", "script"]);

	const [, , params] = Array.from(window.dataLayer[0]);
	assert.deepEqual(params, {
		ad_storage: "denied",
		ad_user_data: "denied",
		ad_personalization: "denied",
		analytics_storage: "denied",
		wait_for_update: 500,
	});
	assert.equal(
		window.dataLayer[2].script,
		`https://www.googletagmanager.com/gtm.js?id=${CONTAINER}`
	);
});

test("returning consented visitor: consent update granted is pushed synchronously, before gtm.js", () => {
	jar.set(COOKIE, "yes");
	loadPage();

	assert.deepEqual(timeline(), [
		"consent default",
		"consent update granted",
		"event gtm.js",
		"script",
	]);
	const [, , params] = Array.from(window.dataLayer[1]);
	assert.deepEqual(params, {
		ad_storage: "granted",
		ad_user_data: "granted",
		ad_personalization: "granted",
		analytics_storage: "granted",
	});
});

test("returning consented visitor: no duplicate consent update once the GTM script has loaded", () => {
	jar.set(COOKIE, "yes");
	loadPage();
	scriptsLoaded();

	assert.equal(count("consent update granted"), 1);
	assert.equal(count("event clc_consent_granted"), 0);
});

test("mandatory category: consent is granted before gtm.js", () => {
	loadPage({ mandatory: true });
	scriptsLoaded();

	assert.deepEqual(timeline(), [
		"consent default",
		"consent update granted",
		"event gtm.js",
		"script",
	]);
});

test("a consent default already defined by another plugin is kept", () => {
	window.dataLayer.push(["consent", "default", { analytics_storage: "denied" }]);
	jar.set(COOKIE, "yes");
	loadPage();

	assert.deepEqual(timeline(), [
		"consent default",
		"consent update granted",
		"event gtm.js",
		"script",
	]);
});

test("a consent default already defined by another plugin is kept (first visit)", () => {
	window.dataLayer.push(["consent", "default", { analytics_storage: "denied" }]);
	loadPage();

	assert.deepEqual(timeline(), ["consent default", "event gtm.js", "script"]);
});

test("first-visit accept: consent update granted, then clc_consent_granted, once", () => {
	const clc = loadPage();
	clc.acceptAll();

	assert.deepEqual(timeline(), [
		"consent default",
		"event gtm.js",
		"script",
		"consent update granted",
		"event clc_consent_granted",
	]);

	// Changing one's mind on the same page does not re-send the event
	clc.denyAll();
	clc.acceptAll();
	scriptsLoaded();
	assert.equal(count("event clc_consent_granted"), 1);
});

test("first-visit deny: consent update denied is pushed exactly once", () => {
	const clc = loadPage();
	clc.denyAll();

	assert.deepEqual(timeline(), [
		"consent default",
		"event gtm.js",
		"script",
		"consent update denied",
	]);

	clc.denyAll();
	assert.equal(count("consent update denied"), 1);
});

test("returning visitor who refused: no consent update on page load", () => {
	jar.set(COOKIE, "no");
	loadPage();

	assert.deepEqual(timeline(), ["consent default", "event gtm.js", "script"]);
});

test("accept then deny on the same page: consent goes back to denied", () => {
	const clc = loadPage();
	clc.acceptAll();
	clc.denyAll();

	assert.deepEqual(timeline().slice(-3), [
		"consent update granted",
		"event clc_consent_granted",
		"consent update denied",
	]);
});

test("returning consented visitor who refuses then accepts again on the page: no clc_consent_granted", () => {
	jar.set(COOKIE, "yes");
	const clc = loadPage();
	clc.denyAll();
	clc.acceptAll();

	// The page_view was already sent with consent: re-sending it would double count
	assert.equal(count("event clc_consent_granted"), 0);
	assert.deepEqual(timeline().slice(-2), [
		"consent update denied",
		"consent update granted",
	]);
});
