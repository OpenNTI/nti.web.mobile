'use strict';

import React  from 'react';
import Store  from '../Store';
import Actions  from '../Actions';
import pagevis from 'common/utils/pagevis';
import away from 'away';
import {analyticsConfig} from 'common/utils';

let _timer;

var Analytics = React.createClass({

	componentDidMount() {
		this._initIdleTimeout();
		window.addEventListener('beforeunload', Actions.endSession);
		pagevis.addChangeListener(visible => {
			Actions[visible ? 'resumeSession' : 'endSession']();
		});
		Store.init();
	},

	_initIdleTimeout() {
		let idleTimeMs = (analyticsConfig().idleTimeoutSeconds || 60) * 1000;
		_timer = away(idleTimeMs);
		_timer.on('idle', Actions.endSession);
		_timer.on('active', Actions.resumeSession);
	},

	render() {
		return null;
	}

});

module.exports = Analytics;
