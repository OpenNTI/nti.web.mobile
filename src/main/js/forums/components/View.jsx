import React from 'react';

import CourseBanner from './widgets/CourseBanner';
import ForumListView from './ForumListView';
import ForumView from './ForumView';

import Router from 'react-router-component';

export default React.createClass({
	displayName: 'ForumsView',

	render () {
		let {course} = this.props;
		return (
			<div>
				<CourseBanner course={course} />
				<div className="forums-wrapper">
					<Router.Locations contextual>
						<Router.Location path="/(:forumId)/*" handler={ForumView} course={course} />
						<Router.Location path="/" handler={ForumListView} course={course} />
					</Router.Locations>
				</div>
			</div>
		);
	}
});
