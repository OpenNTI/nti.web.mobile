import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Router from 'react-router-component';
import {Banner, Mixins} from '@nti/web-commons';


import ContextSender from 'common/mixins/ContextSender';

import ForumListView from './ForumListView';
import ForumView from './ForumView';

export default createReactClass({
	displayName: 'ForumsView',

	mixins: [Mixins.NavigatableMixin, ContextSender],

	propTypes: {
		contentPackage: PropTypes.object
	},

	// title bar back arrow
	getContext () {
		const { contentPackage } = this.props;
		const discussionPath = contentPackage && !contentPackage.isCourse && contentPackage.isBundle ? '/d/' : '/discussions/';
		let href = this.getNavigable().makeHref(discussionPath);

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
						<Router.Location path="/:forumId(/*)"
							handler={ForumView}
							contextID={contentPackage && contentPackage.getID()}
							contentPackage={contentPackage}
						/>

						<Router.Location path="/"
							handler={ForumListView}
							bundle={contentPackage}
						/>
					</Router.Locations>
				</div>
			</div>
		);
	}
});
