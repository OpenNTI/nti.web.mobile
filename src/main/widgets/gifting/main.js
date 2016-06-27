/*bootstrap junk begin*/
import 'babel-polyfill';
import '../../resources/scss/app.scss';
/*bootstrap junk end*/

import React from 'react';
import ReactDOM from 'react-dom';
import QueryString from 'query-string';
import isTouch from 'nti-util-detection-touch';
import {addClass, removeClass} from 'nti-lib-dom';
import 'locale';

const RootNode = document.querySelector('html');
removeClass(RootNode, 'no-js');
addClass(RootNode, 'js');
addClass(RootNode, isTouch ? 'touch' : 'no-touch');

import {overrideConfigAndForceCurrentHost, installAnonymousService} from 'nti-web-client';
import Widget from './widget';


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
