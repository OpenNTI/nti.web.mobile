import React from 'react';

import MembershipButton from './MembershipButton';

export default function GroupControls (props) {
	return (
		<ul>
			<li>
				<a className="gear-button"/>
				<ul className="menu"/>
			</li>
			<li><MembershipButton {...props} /></li>
		</ul>
	);
}
