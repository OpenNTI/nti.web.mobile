import React from 'react';

import ForumListView from './ForumListView';
import ForumsHeading from './widgets/ForumsHeading';

export default React.createClass({
	displayName: 'ForumsView',

	render () {
		return (
			<div>
				<div>(ForumView)</div>
				<ForumsHeading course={this.props.course} />
				<ForumListView />
			</div>
		);
	}
});
