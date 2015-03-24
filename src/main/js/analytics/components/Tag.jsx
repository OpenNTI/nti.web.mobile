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
			else {
				Actions.resumeSession();
			}
		});
		Store.init();
	},

	render() {
		return (
			<div className="buttons">
				<div className="button tiny" onClick={cleanup}>End analytics session</div>
				<div className="button tiny" onClick={Actions.resumeSession}>Resume analytics session</div>
			</div>
		);
	}

});

module.exports = Analytics;
