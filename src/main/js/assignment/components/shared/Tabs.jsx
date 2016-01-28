import React from 'react';
import ActiveState from 'common/components/ActiveState';
import ActiveStateSelector from 'common/mixins/ActiveStateSelector';
import Header from 'common/components/TopicHeader';

export default React.createClass({
	displayName: 'Tabs',
	mixins: [ActiveStateSelector],

	render () {
		return (
			<div className="assignments-nav">
				<Header>Assignments</Header>
				<ul className="filters">
					<li><ActiveState tag="a" href="/" hasChildren>Assignments</ActiveState></li>
					<li><ActiveState tag="a" href="/performance/" hasChildren>Grades &amp; Performance</ActiveState></li>
					<li><ActiveState tag="a" href="/activity/">Activity</ActiveState></li>
				</ul>
			</div>
		);
	}
});
