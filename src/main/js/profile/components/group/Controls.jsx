import React from 'react';

import MembershipButton from './MembershipButton';

export default function GroupControls () {
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
