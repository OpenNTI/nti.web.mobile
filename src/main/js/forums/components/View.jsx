import React from 'react';

import ForumListView from './ForumListView';
import ForumsHeading from './widgets/ForumsHeading';

export default React.createClass({
	displayName: 'ForumsView',

	render () {
		return (
			<div className="forums-wrapper">
				<ForumsHeading course={this.props.course} />
				<ForumListView course={this.props.course} />
			</div>
		);
	}
});
