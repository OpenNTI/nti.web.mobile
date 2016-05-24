import React from 'react';
import Router from 'react-router-component';

import {Banner} from 'nti-web-commons';

import ContextSender from 'common/mixins/ContextSender';
import Navigatable from 'common/mixins/NavigatableMixin';

import ForumListView from './ForumListView';
import ForumView from './ForumView';

export default React.createClass({
	displayName: 'ForumsView',

	mixins: [Navigatable, ContextSender],

	propTypes: {
		contentPackage: React.PropTypes.object
	},

	// title bar back arrow
	getContext () {
		let href = this.getNavigable().makeHref('/discussions/');

		return Promise.resolve({
			label: 'Discussions',
			href
		});
	},

	render () {
		let {contentPackage} = this.props;
		return (
			<div className="forum-view">
				<Banner item={contentPackage} />
				<div className="forums-wrapper">
					<Router.Locations contextual>

						<Router.Location path="/(:forumId)/*"
							handler={ForumView}
							contentPackage={contentPackage}
							/>

						<Router.Location path="/"
							handler={ForumListView}
							contentPackage={contentPackage}
							/>

					</Router.Locations>
				</div>
			</div>
		);
	}
});
