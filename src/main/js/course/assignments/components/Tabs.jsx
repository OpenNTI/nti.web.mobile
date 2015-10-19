import React from 'react';
import ActiveState from 'common/components/ActiveState';
import {Link} from 'react-router-component';

export default React.createClass({
	displayName: 'Tabs',

	render () {
		return (
			<ul {...this.props}>
				<li><ActiveState className="tiny button" tag={Link} href="/">Assignments</ActiveState></li>
				<li><ActiveState className="tiny button" tag={Link} href="/performance/">Grades &amp; Performance</ActiveState></li>
				<li><ActiveState className="tiny button" tag={Link} href="/activity/">Activity</ActiveState></li>
			</ul>
		);
	}
});
