import React from 'react';
import Link from 'common/components/ActiveLink';

export default React.createClass({
	displayName: 'Tabs',

	render () {
		return (
			<ul>
				<li><Link href="/assignments/">Assignments</Link></li>
				<li><Link href="/assignments/performance/">Grades &amp; Performance</Link></li>
				<li><Link href="/assignments/activity/">Activity &amp; Notifications</Link></li>
			</ul>
		);
	}
});
