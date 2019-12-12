export function getCookie(name, dft = undefined) {
	const value = ` ${ document.cookie }`;
	const parts = value.split(` ${ name }=`);
	return (parts.length < 2 ? dft : parts.pop().split(';').shift());
}

export function setCookie(name, value, expiryDays, domain, path, secure) {
	const exdate = new Date();
	exdate.setHours(exdate.getHours() + ((typeof expiryDays !== 'number' ? 365 : expiryDays) * 24));
	document.cookie = `${ name }=${ value };expires=${ exdate.toUTCString() };path=${ path || '/' }${ domain ? `;domain=${ domain }` : '' }${ secure ? ';secure' : '' }`;
}
