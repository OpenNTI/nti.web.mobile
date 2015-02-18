import React from 'react/addons';

import Head from './Head';

export default React.createClass({
	displayName: 'profile:View',

	render () {
		return (
			<div className="profile">
				<Head {...this.props}/>
			</div>
		);
	}
});
