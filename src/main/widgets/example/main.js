/*bootstrap junk begin*/
import 'babel-polyfill';
import '../../resources/scss/app.scss';
/*bootstrap junk end*/

import React from 'react';
import ReactDOM from 'react-dom';
import 'locale';

import {addFeatureCheckClasses} from 'nti-lib-dom';
import {overrideConfigAndForceCurrentHost} from 'nti-web-client';

import Widget from './widget';

addFeatureCheckClasses();

//ensures we talk back to our current host instead of anything else.
overrideConfigAndForceCurrentHost();

const WidgetView = React.createFactory(Widget);
ReactDOM.render(
	WidgetView(),
	document.getElementById('content')
);
