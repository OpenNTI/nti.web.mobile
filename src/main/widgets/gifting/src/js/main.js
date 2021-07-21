/*bootstrap junk begin*/
import '@babel/polyfill';
import '../../../../resources/scss/app.scss';
/*bootstrap junk end*/

import React from 'react';
import ReactDOM from 'react-dom';

import { addFeatureCheckClasses } from '@nti/lib-dom';
import {
	overrideConfigAndForceCurrentHost,
	installAnonymousService,
} from '@nti/web-client';

import 'locale';

import Widget from './widget';

addFeatureCheckClasses();
overrideConfigAndForceCurrentHost(); //ensures we talk back to our current host instead of anything else.
installAnonymousService(); //fakes a service doc.

const props = new URLSearchParams(global.location.search);

const WidgetView = React.createFactory(Widget);
ReactDOM.render(
	WidgetView({
		purchasableId: props.get('purchasableId'),
		headerImage: props.get('header'),
	}),
	document.getElementById('content')
);
