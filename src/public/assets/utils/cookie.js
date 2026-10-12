export function getCookie(name, dft = undefined) {
	for (const cookie of document.cookie.split(";")) {
		const eq = cookie.indexOf("=");
		if (eq < 0) continue;
		if (cookie.slice(0, eq).trim() === name) return cookie.slice(eq + 1);
	}
	return dft;
}

export function setCookie(
	name,
	value,
	expiryDays = 365,
	domain = null,
	path = "/",
	secure = true
) {
	const exdate = new Date();
	exdate.setDate(exdate.getDate() + expiryDays);
	document.cookie = `${name}=${value};expires=${exdate.toUTCString()};path=${path}${
		domain ? `;domain=${domain}` : ""
	}${secure ? ";secure" : ""};samesite=strict;`;
}
