import React from 'react';

import CourseBanner from './widgets/CourseBanner';
import ForumListView from './ForumListView';
import ForumView from './ForumView';
import Breadcrumb from 'common/components/Breadcrumb';
import Router from 'react-router-component';
import Navigatable from 'common/mixins/NavigatableMixin';

export default React.createClass({
	displayName: 'ForumsView',

	mixins: [Navigatable],

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
