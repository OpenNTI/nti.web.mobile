import React from 'react';
import ActiveState from 'common/components/ActiveState';
import {Link} from 'react-router-component';

export default React.createClass({
	displayName: 'Tabs',

	render () {
		return (
			<ul className="assignments-nav filters">
				<li><ActiveState tag={Link} href="/">Assignments</ActiveState></li>
				<li><ActiveState tag={Link} href="/performance/">Grades &amp; Performance</ActiveState></li>
				<li><ActiveState tag={Link} href="/activity/">Activity</ActiveState></li>
			</ul>
		);
	}
});
