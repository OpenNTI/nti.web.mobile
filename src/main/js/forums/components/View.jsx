import React from 'react';

import CourseBanner from './widgets/CourseBanner';
import ForumListView from './ForumListView';
import ForumView from './ForumView';
import Breadcrumb from 'common/components/Breadcrumb';
import Router from 'react-router-component';
import Navigatable from 'common/mixins/NavigatableMixin';
import ContextSender from 'common/mixins/ContextSender';

export default React.createClass({
	displayName: 'ForumsView',

	mixins: [Navigatable, ContextSender],

	// title bar back arrow
	getContext () {
		let href = this.getNavigable().makeHref('/d/');

		return Promise.resolve({
			label: 'Discussions',
			href
		});
	},

	// breadcrumb
	__getContext: function() {
		var href = this.makeHref('/', true);
		return Breadcrumb.noContextProvider().then(context => {
			context.push({
				label: "Discussions",
				href: href
			});
			return context;
		});
	},

	render () {
		let {course} = this.props;
		return (
			<div>
				<CourseBanner course={course} />
				<div className="forums-wrapper">
					<Router.Locations contextual>
						<Router.Location path="/(:forumId)/*" handler={ForumView} course={course} contextProvider={this.__getContext}/>
						<Router.Location path="/" handler={ForumListView} course={course} />
					</Router.Locations>
				</div>
			</div>
		);
	}
});
