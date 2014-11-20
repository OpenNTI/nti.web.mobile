'use strict';

var injected = {};

function exists(parent, key) {
	var parts = key.split('.'),
		part = parts.splice(0, 1)[0];

	if (!part) { return true; }

	parent = parent[part];

	return parent && exists(parent, parts.join('.'));
}

module.exports = {

	injectScript: function(scriptUrl, shouldDefineSymbole) {

		if (!injected[shouldDefineSymbole]) {
			injected[shouldDefineSymbole] = new Promise(function(fullfill,reject) {

				var script = document.createElement('script');

	            script.async = true;//Do not block the UI thread while loading.
	            script.defer = true;//legacy version of async
	            script.charset = 'utf-8'; //Be explicit
				script.type = 'text/javascript'; //Be explicit
				script.src = scriptUrl;

				//Some browsers may not fire an error... so we mush check in the 'load' event
				//for an expected symbol to be defined.
				script.onerror = reject;

				script.onload = function() {

					if (shouldDefineSymbole && !exists(global, shouldDefineSymbole)) {
						return reject('Loaded, but expected interface was not found: "%s"', shouldDefineSymbole);
					}

					fullfill(script);
				};

				//don't inject the element until all handlers are registered. If the src is cached,
				//the handlers may fire before they're registered.
				document.body.appendChild(script);
			});
		}

		return injected[shouldDefineSymbole];
	}
};
