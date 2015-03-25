'use strict';

import React  from 'react';
import Store  from '../Store';
import pagevis from 'common/utils/pagevis';

var Analytics = React.createClass({

	componentDidMount() {
		window.addEventListener('beforeunload', Store.endSession.bind(Store));
		pagevis.addChangeListener(visible => {
			Store[visible ? 'resumeSession' : 'endSession']();
		});
		Store.init();
	},

	render() {
		return null;
	}

});

module.exports = Analytics;
