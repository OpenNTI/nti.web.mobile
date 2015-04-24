import {getSiteName} from '../utils';
import counterpart from 'counterpart';
import english from './en';

counterpart.registerTranslations('en', english);

const siteName = getSiteName();
const locale = counterpart.getLocale();

if (siteName && siteName !== 'unknown') {
	console.debug('Site Locale: %s.%s', siteName, locale);

	let onceLoaded = translation => {
		counterpart.registerTranslations(locale, translation);
		counterpart.emit('localechange', locale, locale);
	};

	//Handwavy magic from webpack...
	require(['./sites/' + siteName + '/' + locale + '.js'], onceLoaded);
	//Someday, it won't be handwavy magic...
	//System.import('./sites/' + siteName + '/' + locale + '.js')
	//	.then(onceLoaded)
	//	.catch(error=>...);
}

export default function translate(...args) {
	return counterpart(...args);
}

export function scoped(scope) {
	return (key, options) => counterpart(key, Object.assign(options || {}, {scope}));
}

export function addChangeListener(fn) {
	counterpart.onLocaleChange(fn);
}

export function removeChangeListener(fn) {
	counterpart.offLocaleChange(fn);
}
