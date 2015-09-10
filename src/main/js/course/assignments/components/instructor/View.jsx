import React from 'react';
import Tabs from '../Tabs';

export default React.createClass({
	displayName: 'Assignments:Instructor:View',

	render () {
		return (
			<div>
				(instructor)
				<Tabs className="assignments-nav button-group filters" />
			</div>
		);
	}
});
