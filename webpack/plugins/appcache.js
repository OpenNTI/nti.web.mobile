/*eslint strict: 0, no-console: 0*/
'use strict';

const NL = '\n';

class AppCache {
	constructor (cache, network, fallback, hash) {
		Object.assign(this, {
			cache, network, fallback, hash, assets: []
		});
	}


	addAsset (asset) {
		return this.assets.push(asset);
	}

	size () {
		return Buffer.byteLength(this.source(), 'utf8');
	}

	getManifestBody () {
		const assets = this.assets || [];
		const cache = this.cache || [];
		const network = this.network || [];
		const fallback = this.fallback || [];

		return [
			assets.length && (
				assets.join(NL) + NL
			),

			cache.length && (
				`CACHE:${NL}${cache.join(NL)}${NL}`
			),

			network.length && (
				`NETWORK:${NL}${network.join(NL)}${NL}`
			),

			fallback.length && (
				`FALLBACK:${NL}${fallback.join(NL)}${NL}`
			)
		]
			.filter(v => v && v.length)
			.join(NL);
	}


	source () {
		return `CACHE MANIFEST${NL}# ${this.hash}${NL}${NL}${this.getManifestBody()}`;
	}
}


class AppCachePlugin {
	constructor (options) {
		this.cache = options && options.cache;
		this.network = (options && options.network) || ['*'];
		this.fallback = options && options.fallback;
	}


	apply (compiler) {

		return compiler.plugin('emit', (work, callback) => {

			try {
				work.chunks.forEach(chunk => {
					if (chunk.name === 'main') {
						this.fallback.unshift('js/main.js ' + chunk.files[0]);
					}
				});

				const appCache = new AppCache(this.cache, this.network, this.fallback, work.hash);

				Object.keys(work.assets).forEach(key => {
					if (/\.(gz)$/.test(key)) {
						return;
					}
					appCache.addAsset(key);
				});

				// console.log(appCache.source());

				work.assets['manifest.appcache'] = appCache;
			} catch(e) {
				console.log(e.stack || e.message || e);
			} finally {
				return callback();
			}
		});
	}
}


module.exports = AppCachePlugin;
