import React from 'react';
import Button from 'common/forms/components/Button';

export default React.createClass({
	displayName: 'GroupControls',

	render () {
		return (
			<ul>
				<li>
					<a className="gear-button"/>
					<ul className="menu"/>
				</li>
				<li><Button className="leave-button">Leave Group</Button></li>
			</ul>
		);
	}
});
