'use strict';

import React  from 'react';
import Store  from '../Store';
import Actions  from '../Actions';
import pagevis from 'common/utils/pagevis';

function cleanup() {
	Actions.endSession();
}

var Analytics = React.createClass({

	componentDidMount() {
		window.addEventListener('beforeunload', cleanup);
		pagevis.addChangeListener(visible => {
			console.log('visibility change ' + visible);
			if (!visible) {
				cleanup();
			}
		});
		Store.init();
	},

	render() {
		return <div className="button tiny" onClick={cleanup}>End analytics session</div>;
	}

});

module.exports = Analytics;
