
let injected = {};

function exists (parent, key) {
	let parts = key.split('.'),
		part = parts.splice(0, 1)[0];

	if (!part) { return true; }

	parent = parent[part];

	return parent && exists(parent, parts.join('.'));
}

export default {

	injectScript (scriptUrl, shouldDefineSymbol) {

		if (!injected[shouldDefineSymbol]) {
			injected[shouldDefineSymbol] = new Promise((fullfill, reject)=> {

				let script = document.createElement('script');

				script.async = true;//Do not block the UI thread while loading.
				script.defer = true;//legacy version of async
				script.charset = 'utf-8'; //Be explicit
				script.type = 'text/javascript'; //Be explicit
				script.src = scriptUrl;

				// Some browsers may not fire an error... so we mush check in the 'load' event
				// for an expected symbol to be defined.
				script.onerror = reject;

				script.onload = ()=> {

					if (shouldDefineSymbol && !exists(global, shouldDefineSymbol)) {
						return reject('Loaded, but expected interface was not found: '.concat(shouldDefineSymbol));
					}

					fullfill(script);
				};

				// don't inject the element until all handlers are registered. If the src is cached,
				// the handlers may fire before they're registered.
				document.body.appendChild(script);
			});
		}

		return injected[shouldDefineSymbol];
	}
};
