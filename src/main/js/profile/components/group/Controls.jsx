import React from 'react';

import MembershipButton from './MembershipButton';

export default React.createClass({
	displayName: 'GroupControls',

	render () {
		return (
			<ul>
				<li>
					<a className="gear-button"/>
					<ul className="menu"/>
				</li>
				<li><MembershipButton {...this.props} /></li>
			</ul>
		);
	}
});
