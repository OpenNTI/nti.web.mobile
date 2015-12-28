/*bootstrap junk begin*/
import 'babel-polyfill';
import '../../resources/scss/app.scss';
/*bootstrap junk end*/

import React from 'react';
import ReactDOM from 'react-dom';

import isTouch from 'nti-lib-interfaces/lib/utils/is-touch-device';
import CSS from 'fbjs/lib/CSSCore';
const RootNode = document.querySelector('html');
CSS.removeClass(RootNode, 'no-js');
CSS.addClass(RootNode, 'js');
CSS.addClass(RootNode, isTouch ? 'touch' : 'no-touch');

import {overrideConfigAndForceCurrentHost} from 'common/utils';

import Widget from './widget';

//ensures we talk back to our current host instead of anything else.
overrideConfigAndForceCurrentHost();

const WidgetView = React.createFactory(Widget);
ReactDOM.render(
	WidgetView(),
	document.getElementById('content')
);
