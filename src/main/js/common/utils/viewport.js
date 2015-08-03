function getDocument () {
	return typeof document === 'undefined' ? {} :
		document.documentElement || {};
}

export function getHeight () {
	return global.innerHeight || getDocument().clientHeight;
}

export function getWidth () {
	return global.innerWidth || getDocument().clientWidth;
}

export function getScreenWidth () {
	let fallback = getWidth();
	return (global.screen || {}).width || fallback;
}

export function getScreenHeight () {
	let fallback = getHeight();
	return (global.screen || {}).height || fallback;
}
