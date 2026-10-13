/**
 * Tests for how CookieLaw (src/public/assets/cookie-law.js) reports the
 * visitor's choices: which actions send a statistic, and which only
 * dispatch the DOM events.
 *
 * The real CookieLaw runs; only initRefs() is replaced (it builds the banner
 * and modal DOM) by event emitters standing in for the banner and the modal.
 * Browser globals are fakes: a cookie jar on `document`, sessionStorage,
 * navigator.sendBeacon.
 */
import "./webpack-hooks.mjs";
import { test, beforeEach, before } from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";

const ENDPOINT = "https://example.test/wp-json/supt/v1/cookie-stats";

let CookieLaw;
let beacons;
let domEvents;

function setGlobal(name, value) {
	Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
}

function fakeDocument() {
	const jar = new Map();
	const doc = new EventTarget();
	Object.defineProperty(doc, "cookie", {
		get: () => [...jar].map(([name, value]) => `${name}=${value}`).join("; "),
		set: (cookie) => {
			const [pair] = cookie.split(";");
			const eq = pair.indexOf("=");
			jar.set(pair.slice(0, eq).trim(), pair.slice(eq + 1));
		},
	});
	return doc;
}

function fakeStorage() {
	const items = new Map();
	return {
		getItem: (key) => (items.has(key) ? items.get(key) : null),
		setItem: (key, value) => items.set(key, String(value)),
	};
}

/** CookieLaw with fake banner & modal: emit their events like the UI does */
function createCookieLaw(config = {}) {
	class TestCookieLaw extends CookieLaw {
		initRefs() {
			const banner = Object.assign(new EventEmitter(), {
				shown: false,
				show() {
					this.shown = true;
				},
				hide() {
					this.shown = false;
				},
				destroy() {},
			});
			const modal = Object.assign(new EventEmitter(), {
				open() {},
				setCategoryEnabled() {},
				destroy() {},
			});
			return { banner, modal };
		}
	}

	return new TestCookieLaw({
		categories: [
			{ id: "necessary", mandatory: true },
			{ id: "analytics" },
			{ id: "marketing" },
		],
		stats_endpoint: ENDPOINT,
		stats_version: "1.1.0",
		...config,
	});
}

async function sentBodies() {
	return Promise.all(beacons.map(async (data) => JSON.parse(await data.text())));
}

const domEventsOf = (type) => domEvents.filter((event) => event.type === `cookielaw:${type}`);

before(async () => {
	// googletagmanager.js touches window.dataLayer when imported
	setGlobal("window", { addEventListener() {}, removeEventListener() {} });
	({ default: CookieLaw } = await import("../src/public/assets/cookie-law.js"));
});

// One "browser" per test: fresh cookies and session
beforeEach(() => {
	beacons = [];
	domEvents = [];

	const doc = fakeDocument();
	for (const type of ["impression", "accept", "reject", "save"]) {
		doc.addEventListener(`cookielaw:${type}`, (event) => domEvents.push(event));
	}
	setGlobal("document", doc);
	setGlobal("sessionStorage", fakeStorage());
	setGlobal("navigator", {
		sendBeacon: (url, data) => {
			beacons.push(data);
			return true;
		},
	});
});

test("first visit: the banner is shown and an impression is sent", async () => {
	const law = createCookieLaw();

	assert.equal(law.refs.banner.shown, true);
	assert.deepEqual(await sentBodies(), [{ event_type: "impression" }]);
	assert.equal(domEventsOf("impression").length, 1);
});

test("the modal save that dismisses the banner sends personalize with the granted categories", async () => {
	const law = createCookieLaw();

	law.refs.banner.emit("personalize");
	law.refs.modal.emit("save", [{ id: "analytics", enabled: true }]);

	assert.equal(law.refs.banner.shown, false);
	assert.deepEqual(await sentBodies(), [
		{ event_type: "impression" },
		{ event_type: "personalize", granted: ["analytics"] },
	]);
	assert.deepEqual(
		domEventsOf("save").map((event) => event.detail),
		[{ granted: ["analytics"] }]
	);
});

test("a later save on the same page sends nothing but still dispatches cookielaw:save", async () => {
	const law = createCookieLaw();

	law.refs.modal.emit("save", [{ id: "analytics", enabled: true }]);
	// Re-opened through the #cookie-law-settings link
	law.refs.modal.emit("save", [{ id: "marketing", enabled: true }]);

	assert.deepEqual(await sentBodies(), [
		{ event_type: "impression" },
		{ event_type: "personalize", granted: ["analytics"] },
	]);
	assert.deepEqual(
		domEventsOf("save").map((event) => event.detail),
		[{ granted: ["analytics"] }, { granted: ["analytics", "marketing"] }]
	);
});

test("a save on a later page (banner already dismissed) sends nothing but still dispatches cookielaw:save", async () => {
	createCookieLaw().refs.banner.emit("acceptAll");
	beacons = [];
	domEvents = [];

	// Next page: the banner cookie is set, so the banner stays hidden
	const law = createCookieLaw();
	law.refs.modal.emit("save", [{ id: "analytics", enabled: false }]);

	assert.equal(law.refs.banner.shown, false);
	assert.deepEqual(await sentBodies(), []);
	assert.equal(domEventsOf("impression").length, 0);
	assert.deepEqual(
		domEventsOf("save").map((event) => event.detail),
		[{ granted: ["marketing"] }]
	);
});

test("accept all and deny all in the banner send accept and reject", async () => {
	createCookieLaw().refs.banner.emit("acceptAll");
	assert.equal(document.cookie.includes("cookie-law-consent_analytics_accepted=yes"), true);

	// Another browser
	setGlobal("document", fakeDocument());
	setGlobal("sessionStorage", fakeStorage());
	createCookieLaw().refs.banner.emit("denyAll");

	assert.deepEqual(await sentBodies(), [
		{ event_type: "impression" },
		{ event_type: "accept" },
		{ event_type: "impression" },
		{ event_type: "reject" },
	]);
});

test("without stats_endpoint, choices send nothing but dispatch the DOM events", async () => {
	const law = createCookieLaw({ stats_endpoint: undefined });

	law.refs.banner.emit("personalize");
	law.refs.modal.emit("save", [{ id: "marketing", enabled: true }]);

	assert.equal(beacons.length, 0);
	assert.deepEqual(
		domEvents.map((event) => [event.type, event.detail]),
		[
			["cookielaw:impression", null],
			["cookielaw:save", { granted: ["marketing"] }],
		]
	);
});
