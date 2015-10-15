import {externalLibraries} from 'common/utils';

const injected = {};

function getSymbol (scope, expression) {
	const path = expression.split('.').reverse();

	let prop;
	while(path.length > 1 && scope) {
		prop = path.pop();
		scope = scope[prop];
	}

	const leafExists = scope && scope.hasOwnProperty(path[0]);

	if (!scope || path.length > 1 || !leafExists) {
		if (!leafExists) {
			prop = path[0];
		}
		console.warn(`"${expression}" did not evaluate to a value. Last property tried: ${prop}`);
		return false;
	}

	return {
		scope,
		symbol: scope[path.pop()]
	};
}

function appendToSingletonElement (document, tagName, child) {
	const el = (document[tagName] || document.getElementsByTagName(tagName)[0]);
	el.appendChild(child);
}

function createElement (document, tag, props) {
	const el = document.createElement(tag);
	Object.assign(el, props || {});
	return el;
}

export default {

	injectExternalLibrary (id) {
		const config = externalLibraries();

		const lib = config[id] || {};
		const {requires = [], url, definesSymbol, invokeDefinedSymbol = false, stylesheets = []} = lib;


		if (!url) {
			return Promise.reject(`No ${id} Library (properly) Defined`);
		}

		if (!definesSymbol) {
			return Promise.reject(`Library ${id} should have an expression for "definesSymbol"`);
		}

		return Promise.all(requires.map(dep => this.injectExternalLibrary(dep)))
			.then(() => {
				this.injectStyles(stylesheets, id);
				return this.injectScript(url, definesSymbol, invokeDefinedSymbol);
			});
	},


	injectStyles (urls, forDep) {
		const promises = [];

		for (let url of urls) {
			const id = `${forDep}-${url.replace(/[\/\\]/gi, '-')}`;

			if (!injected[id]) {
				injected[id] = new Promise((fulfill, reject) => {
					let i = 0;
					const link = createElement(document, 'link', {
						rel: 'stylesheet',
						type: 'text/css',
						href: url,
						id
					});

					function check () {
						if (link.style) { fulfill(link); }

						//30 seconds, if each interval is 10ms
						else if (i++ > 3000) { reject('Timeout'); }

						else {
							schedualCheck();
						}
					}

					function schedualCheck () {
						setTimeout(check, 10);
					}


					appendToSingletonElement(document, 'head', link);
					schedualCheck();
				});
			}

			promises.push(injected[id]);
		}

		return Promise.all(promises);
	},


	injectScript (scriptUrl, shouldDefineSymbol, invokeDefinedSymbol) {

		if (!injected[shouldDefineSymbol]) {
			injected[shouldDefineSymbol] = new Promise((fulfill, reject)=> {

				let script = createElement(document, 'script', {
					async: true, //Do not block the UI thread while loading.
					defer: true, //legacy version of async
					charset: 'utf-8',  //Be explicit
					type: 'text/javascript', //Be explicit
					src: scriptUrl,

					// Some browsers may not fire an error... so we mush check in the 'load' event
					// for an expected symbol to be defined.
					onerror: reject,

					onload: ()=> {
						const symbolDescriptor = getSymbol(global, shouldDefineSymbol);

						if (shouldDefineSymbol && !symbolDescriptor) {
							return reject('Loaded, but expected interface was not found: '.concat(shouldDefineSymbol));
						} else if (invokeDefinedSymbol) {
							const {scope, symbol} = symbolDescriptor;
							symbol.call(scope);
						}

						fulfill(script);
					}
				});

				// don't inject the element until all handlers are registered. If the src is cached,
				// the handlers may fire before they're registered.
				appendToSingletonElement(document, 'body', script);
			});
		}

		return injected[shouldDefineSymbol];
	}

};
