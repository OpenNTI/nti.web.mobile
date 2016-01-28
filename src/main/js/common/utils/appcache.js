import Logger from 'nti-util-logger';
import VisibilityMonitor from './pagevis';

const logger = Logger.get('common:utils:appcache');
const cache = global.applicationCache;

const cacheStatusValues = [
	'uncached',		//0
	'idle',			//1
	'checking',		//2
	'downloading',	//3
	'updateready',	//4
	'obsolete'		//5
];


function logEvent (e) {
	const online = (navigator.onLine) ? 'yes' : 'no';
	const status = cacheStatusValues[cache.status];

	let message = `online: ${online}, event: ${e.type}, status: ${status}`;
	if (e.type === 'error' && navigator.onLine) {
		message += ' (missing or syntax error in manifest?)';
	}

	logger.debug(message);
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
			logger.debug('swap cache has been called');
		},
		false
	);

	VisibilityMonitor.addChangeListener(visible => {
		if (!visible) {
			return;
		}

		try {
			if(cache && cache.status) {
				logger.debug('Updating AppCache... current status: %s', cacheStatusValues[cache.status]);
				cache.update();
			}
		} catch (e) {
			logger.warn(e.stack || e.message || e);
		}
	});
}
