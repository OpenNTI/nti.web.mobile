import VisibilityMonitor from './pagevis';

let cache = global.applicationCache;

const cacheStatusValues = [
	'uncached',		//0
	'idle',			//1
	'checking',		//2
	'downloading',	//3
	'updateready',	//4
	'obsolete'		//5
];


function logEvent(e) {
	let online, status, type, message;
	online = (navigator.onLine) ? 'yes' : 'no';
	status = cacheStatusValues[cache.status];
	type = e.type;
	message = 'online: ' + online;
	message += ', event: ' + type;
	message += ', status: ' + status;
	if (type === 'error' && navigator.onLine) {
		message += ' (missing or syntax error in manifest?)';
	}
	console.debug(message);
}


if (cache) {
	cache.addEventListener('cached', logEvent, false);
	cache.addEventListener('checking', logEvent, false);
	cache.addEventListener('downloading', logEvent, false);
	cache.addEventListener('error', logEvent, false);
	cache.addEventListener('noupdate', logEvent, false);
	cache.addEventListener('obsolete', logEvent, false);
	cache.addEventListener('progress', logEvent, false);
	cache.addEventListener('updateready', logEvent, false);

	cache.addEventListener('updateready',
		() => {
			cache.swapCache();
			console.debug('swap cache has been called');
		},
		false
	);

	VisibilityMonitor.addChangeListener(visible => {
		if (!visible) {
			return;
		}

		try {
			if(cache && cache.status){
				console.debug('Updating AppCache... current status: %s', cacheStatusValues[cache.status]);
				cache.update();
			}
		} catch (e) {
			console.warn(e.stack || e.message || e);
		}
	});
}
