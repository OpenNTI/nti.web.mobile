import React from 'react';

import CourseBanner from './widgets/CourseBanner';
import ForumListView from './ForumListView';
import ForumView from './ForumView';
import Router from 'react-router-component';
import Navigatable from 'common/mixins/NavigatableMixin';
import ContextSender from 'common/mixins/ContextSender';

export default React.createClass({
	displayName: 'ForumsView',

	mixins: [Navigatable, ContextSender],

	propTypes: {
		contentPackage: React.PropTypes.object
	},

	// title bar back arrow
	getContext () {
		let href = this.getNavigable().makeHref('/d/');

		return Promise.resolve({
			label: 'Discussions',
			href
		});
	},

	render () {
		let contentPackage = this.props.course || this.props.contentPackage;
		return (
			<div>
				<CourseBanner course={contentPackage} />
				<div className="forums-wrapper">
					<Router.Locations contextual>
						<Router.Location path="/(:forumId)/*" handler={ForumView} course={contentPackage} contextProvider={this.getContext}/>
						<Router.Location path="/" handler={ForumListView} course={contentPackage} />
					</Router.Locations>
				</div>
			</div>
		);
	}
});
