import React from 'react';
import Store from '../Store';
import pagevis from 'common/utils/pagevis';

export default React.createClass({
	displayName: 'Analytics',

	componentDidMount () {
		window.addEventListener('beforeunload', ()=> void Store.endSession());
		pagevis.addChangeListener(visible => {
			Store[visible ? 'resumeSession' : 'endSession']('page vis change');
		});
		Store.init();
	},

	render () {
		// return <div className="button tiny" onClick={Store.endSession.bind(Store)}>Halt</div>;
		return null;
	}

});
