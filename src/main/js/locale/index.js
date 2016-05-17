import {getSiteName} from 'nti-web-client';
import {registerTranslations, getLocale} from 'nti-lib-locale';
import english from './en';

registerTranslations('en', english);

const siteName = getSiteName();
const locale = getLocale();

if (siteName && siteName !== 'unknown') {
	console.debug('Site Locale: %s.%s', siteName, locale); //eslint-disable-line

	let onceLoaded = moduleExports => {
		let {default: translation} = moduleExports;
		registerTranslations(locale, translation);
	};

	//Handwavy magic from webpack...
	require(['./sites/' + siteName + '/' + locale + '.js'], onceLoaded);
	//Someday, it won't be handwavy magic...
	//System.import('./sites/' + siteName + '/' + locale + '.js')
	//	.then(onceLoaded)
	//	.catch(error=>...);
}
