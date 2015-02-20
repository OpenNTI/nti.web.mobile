function getDocument() {
	return typeof document === 'undefined' ? {} :
		document.documentElement || {};
}

export function getHeight () {
	return global.innerHeight || getDocument().clientHeight;
}

export function getWidth  () {
	return global.innerWidth || getDocument().clientWidth;
}

export function getScreenWidth () {
	var fallback = getWidth();
	return (global.screen || {}).width || fallback;
}

export function getScreenHeight () {
	var fallback = getHeight();
	return (global.screen || {}).height || fallback;
}
