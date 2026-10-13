/**
 * Tests for the consent statistics helper (src/public/assets/utils/stats.js).
 *
 * Run with `yarn test` (Node's built-in test runner, no dependencies).
 * The browser globals the helper uses (document, sessionStorage, navigator,
 * fetch) are replaced by fakes before each test.
 */
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import createConsentStats, {
	compareVersions,
	sendStat,
} from "../src/public/assets/utils/stats.js";

const ENDPOINT = "https://example.test/wp-json/supt/v1/cookie-stats";

let beacons;
let fetches;
let domEvents;
let storage;
let originals;

function fakeStorage() {
	const items = new Map();
	return {
		items,
		getItem: (key) => (items.has(key) ? items.get(key) : null),
		setItem: (key, value) => items.set(key, String(value)),
		removeItem: (key) => items.delete(key),
	};
}

function setGlobal(name, value) {
	Object.defineProperty(globalThis, name, {
		value,
		configurable: true,
		writable: true,
	});
}

async function beaconBodies() {
	return Promise.all(beacons.map(async ({ data }) => JSON.parse(await data.text())));
}

beforeEach(() => {
	originals = ["document", "sessionStorage", "navigator", "fetch"].map((name) => [
		name,
		Object.getOwnPropertyDescriptor(globalThis, name),
	]);

	beacons = [];
	fetches = [];
	domEvents = [];
	storage = fakeStorage();

	const doc = new EventTarget();
	for (const type of ["impression", "accept", "reject", "save"]) {
		doc.addEventListener(`cookielaw:${type}`, (event) => domEvents.push(event));
	}

	setGlobal("document", doc);
	setGlobal("sessionStorage", storage);
	setGlobal("navigator", {
		sendBeacon: (url, data) => {
			beacons.push({ url, data });
			return true;
		},
	});
	setGlobal("fetch", (url, options) => {
		fetches.push({ url, options });
		return Promise.resolve({ ok: true });
	});
});

afterEach(() => {
	for (const [name, descriptor] of originals) {
		if (descriptor) Object.defineProperty(globalThis, name, descriptor);
		else delete globalThis[name];
	}
});

// ##############################
// Without wp-cookie-consent-analytics
// ##############################

test("without stats_endpoint, nothing is sent and sessionStorage is not touched", () => {
	let storageUsed = false;
	setGlobal("sessionStorage", {
		getItem: () => {
			storageUsed = true;
			return null;
		},
		setItem: () => {
			storageUsed = true;
		},
	});

	const stats = createConsentStats({ cookieName: "clc" });
	stats.impression();
	stats.accept();
	stats.reject();
	stats.save(["analytics"], true);

	assert.equal(beacons.length, 0);
	assert.equal(fetches.length, 0);
	assert.equal(storageUsed, false);
});

test("without stats_endpoint, the DOM events are still dispatched", () => {
	const stats = createConsentStats({ cookieName: "clc" });
	stats.impression();
	stats.accept();
	stats.reject();
	stats.save(["analytics"], false);

	assert.deepEqual(
		domEvents.map((event) => event.type),
		["cookielaw:impression", "cookielaw:accept", "cookielaw:reject", "cookielaw:save"]
	);
	assert.deepEqual(domEvents[3].detail, { granted: ["analytics"] });
});

// ##############################
// With wp-cookie-consent-analytics
// ##############################

test("impression is sent once per browser session", async () => {
	const config = { cookieName: "clc", stats_endpoint: ENDPOINT };

	createConsentStats(config).impression();
	// Next page of the same session: a new instance, same sessionStorage
	createConsentStats(config).impression();
	createConsentStats(config).impression();

	assert.deepEqual(await beaconBodies(), [{ event_type: "impression" }]);
	assert.equal(beacons[0].url, ENDPOINT);
	assert.equal(beacons[0].data.type, "application/json");
	// The DOM event fires on every page the banner is shown
	assert.equal(domEvents.length, 3);
});

test("accept and reject send one event each", async () => {
	const config = { cookieName: "clc", stats_endpoint: ENDPOINT };

	createConsentStats(config).accept();
	createConsentStats(config).reject();

	assert.deepEqual(await beaconBodies(), [
		{ event_type: "accept" },
		{ event_type: "reject" },
	]);
});

test("personalize is only sent for the save that dismisses the banner", async () => {
	const stats = createConsentStats({
		cookieName: "clc",
		stats_endpoint: ENDPOINT,
		stats_version: "1.0.0",
	});

	stats.save(["analytics"], true);
	stats.save([], false); // later change through the #hash link

	assert.deepEqual(await beaconBodies(), [{ event_type: "personalize" }]);
	// Both saves dispatch the DOM event
	assert.deepEqual(
		domEvents.map((event) => event.detail),
		[{ granted: ["analytics"] }, { granted: [] }]
	);
});

test("personalize only includes granted from wp-cookie-consent-analytics 1.1.0", async () => {
	const versions = ["", "1.0.0", "1.0.9", "1.1.0", "1.2.3", "2.0.0", "1.10.0"];

	for (const stats_version of versions) {
		createConsentStats({
			cookieName: `clc-${stats_version}`,
			stats_endpoint: ENDPOINT,
			stats_version,
		}).save(["analytics", "marketing"], true);
	}

	assert.deepEqual(await beaconBodies(), [
		{ event_type: "personalize" },
		{ event_type: "personalize" },
		{ event_type: "personalize" },
		{ event_type: "personalize", granted: ["analytics", "marketing"] },
		{ event_type: "personalize", granted: ["analytics", "marketing"] },
		{ event_type: "personalize", granted: ["analytics", "marketing"] },
		{ event_type: "personalize", granted: ["analytics", "marketing"] },
	]);
});

// ##############################
// Sampling
// ##############################

test("a sample rate of 0 sends nothing but still dispatches the DOM events", () => {
	const stats = createConsentStats({
		cookieName: "clc",
		stats_endpoint: ENDPOINT,
		stats_sample_rate: "0", // wp_localize_script casts scalars to strings
	});
	stats.impression();
	stats.accept();
	stats.save([], true);

	assert.equal(beacons.length + fetches.length, 0);
	assert.equal(domEvents.length, 3);
});

test("the sampling decision is made once per session and shared by impressions and choices", async () => {
	const originalRandom = Math.random;
	const config = { cookieName: "clc", stats_endpoint: ENDPOINT, stats_sample_rate: "0.5" };

	try {
		Math.random = () => 0.9; // out of the sample
		createConsentStats(config).impression();

		Math.random = () => 0.1; // would be in the sample if drawn again
		createConsentStats(config).impression();
		createConsentStats(config).accept();
	} finally {
		Math.random = originalRandom;
	}

	assert.equal(beacons.length, 0);
	assert.deepEqual(JSON.parse(storage.items.get("clc_stats")), {
		sampled: false,
		impression: false,
	});

	// A new session (empty sessionStorage) draws again
	storage.items.clear();
	try {
		Math.random = () => 0.1;
		createConsentStats(config).impression();
		Math.random = () => 0.9;
		createConsentStats(config).accept();
	} finally {
		Math.random = originalRandom;
	}

	assert.deepEqual(await beaconBodies(), [
		{ event_type: "impression" },
		{ event_type: "accept" },
	]);
});

test("an invalid sample rate falls back to 1", () => {
	createConsentStats({
		cookieName: "clc",
		stats_endpoint: ENDPOINT,
		stats_sample_rate: "not a number",
	}).accept();

	assert.equal(beacons.length, 1);
});

// ##############################
// Robustness & transport
// ##############################

test("never throws when sessionStorage is unavailable", () => {
	setGlobal("sessionStorage", {
		getItem: () => {
			throw new Error("SecurityError");
		},
		setItem: () => {
			throw new Error("QuotaExceededError");
		},
	});

	const stats = createConsentStats({ cookieName: "clc", stats_endpoint: ENDPOINT });
	assert.doesNotThrow(() => {
		stats.impression();
		stats.impression(); // still deduplicated within the page
		stats.accept();
	});
	assert.equal(beacons.length, 2);
});

test("never throws when sessionStorage holds garbage", () => {
	storage.setItem("clc_stats", "{not json");

	const stats = createConsentStats({ cookieName: "clc", stats_endpoint: ENDPOINT });
	assert.doesNotThrow(() => stats.impression());
	assert.equal(beacons.length, 1);
});

test("falls back to fetch with keepalive when sendBeacon is missing", async () => {
	setGlobal("navigator", {});

	sendStat(ENDPOINT, { event_type: "accept" });

	assert.equal(fetches.length, 1);
	assert.equal(fetches[0].url, ENDPOINT);
	assert.equal(fetches[0].options.method, "POST");
	assert.equal(fetches[0].options.keepalive, true);
	assert.equal(fetches[0].options.headers["Content-Type"], "application/json");
	assert.deepEqual(JSON.parse(fetches[0].options.body), { event_type: "accept" });
});

test("falls back to fetch when sendBeacon throws or refuses the data", () => {
	setGlobal("navigator", {
		sendBeacon: () => {
			throw new TypeError("disallowed");
		},
	});
	sendStat(ENDPOINT, { event_type: "accept" });

	setGlobal("navigator", { sendBeacon: () => false });
	sendStat(ENDPOINT, { event_type: "reject" });

	assert.equal(fetches.length, 2);
});

test("never throws when the transport fails", async () => {
	setGlobal("navigator", {});
	setGlobal("fetch", () => Promise.reject(new TypeError("Failed to fetch")));
	assert.doesNotThrow(() => sendStat(ENDPOINT, { event_type: "accept" }));

	setGlobal("fetch", () => {
		throw new TypeError("sync failure");
	});
	assert.doesNotThrow(() => sendStat(ENDPOINT, { event_type: "accept" }));

	setGlobal("fetch", undefined);
	assert.doesNotThrow(() => sendStat(ENDPOINT, { event_type: "accept" }));

	// Let the rejected promise settle: an unhandled rejection would fail the run
	await new Promise((resolve) => setTimeout(resolve, 0));
});

test("compareVersions", () => {
	assert.equal(compareVersions("1.1.0", "1.1.0"), 0);
	assert.equal(compareVersions("1.0.0", "1.1.0"), -1);
	assert.equal(compareVersions("1.10.0", "1.9.0"), 1);
	assert.equal(compareVersions("2", "1.1.0"), 1);
	assert.equal(compareVersions(undefined, "1.1.0"), -1);
});
