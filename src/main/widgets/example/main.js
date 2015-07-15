/*bootstrap junk begin*/
require('babel/polyfill');

require('../../resources/scss/app.scss');
require('script!../../resources/vendor/modernizr/modernizr.js');
/*bootstrap junk end*/

import React from 'react';

import FastClick from 'fastclick';

import {overrideConfigAndForceCurrentHost} from 'common/utils';

import Widget from './widget';

FastClick.attach(document.body);

//ensures we talk back to our current host instead of anything else.
overrideConfigAndForceCurrentHost();

React.initializeTouchEvents(true);

const WidgetView = React.createFactory(Widget);
React.render(
	WidgetView(),
	document.getElementById('content')
);
