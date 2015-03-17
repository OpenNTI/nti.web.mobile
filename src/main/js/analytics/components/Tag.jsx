'use strict';

import React  from 'react';
import Store  from '../Store';
import Actions  from '../Actions';

function cleanup() {
	Actions.endSession();
}

var Analytics = React.createClass({

	componentDidMount() {
		window.addEventListener('beforeunload', cleanup);
		Store.init();
	},

	render: function() {
		return null;
	}

});

module.exports = Analytics;
