/*eslint no-var: 0 strict: 0*/
'use strict';
function AppCache (cache, network, fallback, hash) {
	this.cache = cache;
	this.network = network;
	this.fallback = fallback;
	this.hash = hash;
	this.assets = [];
}


AppCache.prototype.addAsset = function (asset) {
	return this.assets.push(asset);
};

AppCache.prototype.size = function () {
	return Buffer.byteLength(this.source(), 'utf8');
};

AppCache.prototype.getManifestBody = function () {
	var assets = this.assets || [],
		cache = this.cache || [],
		network = this.network || [],
		fallback = this.fallback || [];
	return [
		assets.length && (assets.join('\n') + '\n'),
		cache.length && ('CACHE:\n' + cache.join('\n') + '\n'),
		network.length && ('NETWORK:\n' + network.join('\n') + '\n'),
		fallback.length && ('FALLBACK:\n' + fallback.join('\n') + '\n')
	]
		.filter(function (v) { return v && v.length; })
		.join('\n');
};


AppCache.prototype.source = function () {
	return 'CACHE MANIFEST\n# ' + this.hash + '\n\n' + this.getManifestBody();
};


function AppCachePlugin (options) {
	this.cache = options && options.cache;
	this.network = (options && options.network) || ['*'];
	this.fallback = options && options.fallback;
}


AppCachePlugin.prototype.apply = function (compiler) {
	var me = this;

	return compiler.plugin('emit', function (work, callback) {

		try {
			work.chunks.forEach(function (chunk) {
				if (chunk.name === 'main') {
					me.fallback.unshift('js/main.js ' + chunk.files[0]);
				}
			});

			var appCache = new AppCache(
				me.cache,
				me.network,
				me.fallback,
				work.hash);

			Object.keys(work.assets).forEach(function (key) {
				if (/\.(gz)$/.test(key)) {
					return;
				}
				appCache.addAsset(key);
			});

			work.assets['manifest.appcache'] = appCache;
		} catch(e) {
			console.log(e.stack || e.message || e);
		} finally {
			return callback();
		}
	});
};


module.exports = AppCachePlugin;
