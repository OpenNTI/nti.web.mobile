/*bootstrap junk begin*/
import 'babel-polyfill';
import '../../../../resources/scss/app.scss';
/*bootstrap junk end*/

import React from 'react';
import ReactDOM from 'react-dom';
import QueryString from 'query-string';
import {addFeatureCheckClasses} from 'nti-lib-dom';
import 'locale';

import {overrideConfigAndForceCurrentHost, installAnonymousService} from 'nti-web-client';
import Widget from './widget';


addFeatureCheckClasses();
overrideConfigAndForceCurrentHost();//ensures we talk back to our current host instead of anything else.
installAnonymousService();//fakes a service doc.

const props = QueryString.parse(global.location.search);


const WidgetView = React.createFactory(Widget);
ReactDOM.render(
	WidgetView({
		purchasableId: props.purchasableId,
		headerImage: props.header
	}),
	document.getElementById('content')
);