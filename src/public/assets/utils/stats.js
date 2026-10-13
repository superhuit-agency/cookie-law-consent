/**
 * Consent statistics & DOM events
 *
 * Always dispatches `cookielaw:impression`, `cookielaw:accept`,
 * `cookielaw:reject` and `cookielaw:save` (`detail: { granted }`) on `document`.
 *
 * When `config.stats_endpoint` is set (wp-cookie-consent-analytics is active),
 * also sends the banner events to it: one `impression` per browser session,
 * and one `accept` / `reject` / `personalize` per first choice. Sending never
 * blocks nor throws, and needs no nonce so it works on cached pages.
 */

/** First wp-cookie-consent-analytics version accepting `granted` with `personalize` */
export const GRANTED_MIN_VERSION = "1.1.0";

/**
 * Compare two `x.y.z` version strings
 *
 * Follows semver precedence for the core part: build metadata (`+…`) is
 * ignored and a pre-release (`1.1.0-beta.1`) ranks below its release
 * (`1.1.0`). Pre-releases of the same core version compare equal.
 *
 * @return {number} -1, 0 or 1
 */
export function compareVersions(a, b) {
	const parse = (version) => {
		const [core, ...pre] = String(version ?? "")
			.split("+")[0]
			.split("-");
		return {
			core: core.split(".").map((part) => parseInt(part, 10) || 0),
			pre: pre.length > 0,
		};
	};
	const va = parse(a);
	const vb = parse(b);

	for (let i = 0; i < Math.max(va.core.length, vb.core.length, 3); i++) {
		const diff = (va.core[i] ?? 0) - (vb.core[i] ?? 0);
		if (diff !== 0) return diff > 0 ? 1 : -1;
	}
	if (va.pre !== vb.pre) return va.pre ? -1 : 1;
	return 0;
}

/**
 * POST a JSON body without blocking page navigation:
 * sendBeacon, falling back to fetch with keepalive. Never throws.
 */
export function sendStat(endpoint, body) {
	let json;
	try {
		json = JSON.stringify(body);
		if (
			typeof navigator !== "undefined" &&
			typeof navigator.sendBeacon === "function" &&
			navigator.sendBeacon(
				endpoint,
				new Blob([json], { type: "application/json" })
			)
		)
			return;
	} catch (e) {
		// Fall back to fetch
	}

	try {
		if (typeof fetch !== "function") return;
		fetch(endpoint, {
			method: "POST",
			keepalive: true,
			headers: { "Content-Type": "application/json" },
			body: json,
		}).catch(() => {});
	} catch (e) {
		// Statistics must never break the banner
	}
}

function dispatch(type, detail) {
	try {
		document.dispatchEvent(
			new CustomEvent(`cookielaw:${type}`, detail ? { detail } : undefined)
		);
	} catch (e) {
		// Ignore: no DOM or no CustomEvent support
	}
}

function readSession(key) {
	try {
		const state = JSON.parse(sessionStorage.getItem(key));
		return typeof state?.sampled === "boolean" ? state : null;
	} catch (e) {
		return null;
	}
}

function writeSession(key, state) {
	try {
		sessionStorage.setItem(key, JSON.stringify(state));
	} catch (e) {
		// Private mode, storage disabled or full: keep the in-memory state only
	}
}

/**
 * @param {Object} config The front-end config (clc_config merged with the defaults)
 *
 * @return {{impression: Function, accept: Function, reject: Function, save: Function}}
 */
export default function createConsentStats(config = {}) {
	const endpoint =
		typeof config.stats_endpoint === "string" ? config.stats_endpoint : "";
	// wp_localize_script casts scalars to strings
	const rate = parseFloat(config.stats_sample_rate);
	const sampleRate = Number.isFinite(rate) ? Math.min(Math.max(rate, 0), 1) : 1;
	const withGranted =
		compareVersions(config.stats_version, GRANTED_MIN_VERSION) >= 0;
	const storageKey = `${config.cookieName}_stats`;

	// Fallback for when sessionStorage is unavailable
	let memory = null;

	const save = (state) => {
		memory = state;
		writeSession(storageKey, state);
	};

	// Sampling is decided once per session, impressions and choices share it
	const session = () => {
		let state = readSession(storageKey) ?? memory;
		if (!state) {
			state = { sampled: Math.random() < sampleRate, impression: false };
			save(state);
		}
		return state;
	};

	const send = (body) => {
		if (!endpoint || !session().sampled) return;
		sendStat(endpoint, body);
	};

	return {
		/** The banner is shown */
		impression() {
			if (endpoint) {
				const state = session();
				if (state.sampled && !state.impression) {
					save({ ...state, impression: true });
					sendStat(endpoint, { event_type: "impression" });
				}
			}
			dispatch("impression");
		},

		/** "Accept all" clicked in the banner */
		accept() {
			send({ event_type: "accept" });
			dispatch("accept");
		},

		/** "Deny all" clicked in the banner */
		reject() {
			send({ event_type: "reject" });
			dispatch("reject");
		},

		/**
		 * Preferences saved in the modal
		 *
		 * @param {string[]} granted Ids of the accepted non-mandatory categories
		 * @param {boolean} firstChoice Whether this save dismissed the banner
		 */
		save(granted, firstChoice) {
			// Later changes (#hash link) are not sent:
			// the endpoint has no event type for them
			if (firstChoice)
				send(
					withGranted
						? { event_type: "personalize", granted }
						: { event_type: "personalize" }
				);
			dispatch("save", { granted });
		},
	};
}
