import React from 'react';
import Store from '../Store';
import pagevis from 'common/utils/pagevis';

export default React.createClass({
	displayName: 'Analytics',

	componentDidMount () {
		window.addEventListener('beforeunload', ()=> void Store.endSession());
		pagevis.addChangeListener(visible =>
			void Store[visible ? 'resumeSession' : 'endSession']('page vis change'));
		Store.init();
	},

	render () {
		// return <div className="button tiny" onClick={()=> void Store.endSession()}>Halt</div>;
		return null;
	}

});
