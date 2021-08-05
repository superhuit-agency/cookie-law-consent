export function getCookie(name, dft = undefined) {
	const cookies = document.cookie.split(';');
	const idx = cookies.findIndex((c) => c.includes(name));
	return (idx >= 0 ? cookies[idx].split('=')[1] : dft);
}

export function setCookie(name, value, expiryDays = 365, domain = null, path = '/', secure = true) {
	const exdate = new Date();
	exdate.setDate(exdate.getDate() + expiryDays);
	document.cookie = `${ name }=${ value };expires=${ exdate.toUTCString() };path=${ path }${ domain ? `;domain=${ domain }` : '' }${ secure ? ';secure' : '' };samesite=strict;`;
}
