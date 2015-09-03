import React from 'react';

export default React.createClass({
	displayName: 'Tabs',

	render () {
		return (
			<ul>
				<li>Assignments</li>
				<li>Grades &amp; Performance</li>
				<li>Activity &amp; Notifications</li>
			</ul>
		);
	}
});
