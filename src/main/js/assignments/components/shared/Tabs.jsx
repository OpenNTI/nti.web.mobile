import React from 'react';
import ActiveState from 'common/components/ActiveState';
import ActiveStateSelector from 'common/mixins/ActiveStateSelector';

export default React.createClass({
	displayName: 'Tabs',
	mixins: [ActiveStateSelector],

	render () {
		return (
			<ul className="assignments-nav filters">
				<li><ActiveState tag="a" href="/" hasChildren>Assignments</ActiveState></li>
				<li><ActiveState tag="a" href="/performance/" hasChildren>Grades &amp; Performance</ActiveState></li>
				<li><ActiveState tag="a" href="/activity/">Activity</ActiveState></li>
			</ul>
		);
	}
});
