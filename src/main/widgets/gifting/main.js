/*bootstrap junk begin*/
require('babel/polyfill');

require('script!../../resources/vendor/modernizr/modernizr.js');
require('../../resources/scss/app.scss');
/*bootstrap junk end*/

import React from 'react';
import ReactDOM from 'react-dom';
import QueryString from 'query-string';
import FastClick from 'fastclick';

import {overrideConfigAndForceCurrentHost, installAnonymousService} from 'common/utils';

import Widget from './widget';

FastClick.attach(document.body);
overrideConfigAndForceCurrentHost();//ensures we talk back to our current host instead of anything else.
installAnonymousService();//fakes a service doc.

React.initializeTouchEvents(true);
const props = QueryString.parse(global.location.search);


const WidgetView = React.createFactory(Widget);
ReactDOM.render(
	WidgetView({
		purchasableId: props.purchasableId,
		headerImage: props.header
	}),
	document.getElementById('content')
);
