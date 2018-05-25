import path from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {Link} from 'react-router-component';
import {addHistory} from '@nti/lib-analytics';
import {scoped} from '@nti/lib-locale';
import { decodeFromURI } from '@nti/lib-ntiids';
import {StoreEventsMixin} from '@nti/lib-store';
import { Error as Err, Loading, Mixins, Prompt} from '@nti/web-commons';

import * as Actions from '../Actions';
import paging from '../mixins/Paging';
import LoadForum from '../mixins/LoadForum';
import Store from '../Store';
import { FORUM, FORUM_DELETED } from '../Constants';

import TopicList from './TopicList';
import ViewHeader from './widgets/ViewHeader';

const DEFAULT_TEXT = {
	create: 'Create a discussion',
	deletePrompt: 'Delete this forum?'
};

const t = scoped('forums.topic', DEFAULT_TEXT);
const Transition = x => <CSSTransition appear classNames="fade-out-in" timeout={500} {...x}/>;

const ERROR_CODE = '404 Not Found';

export default createReactClass({
	displayName: 'Topics',

	mixins: [Mixins.NavigatableMixin, StoreEventsMixin, LoadForum],

	propTypes: {
		forumId: PropTypes.string,
		forum: PropTypes.object,
		contentPackage: PropTypes.shape({
			getID: PropTypes.fun
		})
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		[FORUM_DELETED] (event) {
			const discussions = path.resolve(this.getNavigable().getEnvironment().getPath(), '..');
			this.navigateRoot(`${discussions}/`);
		}
	},

	getInitialState () {
		return {
			loading: true
		};
	},

	componentWillUnmount () {
		addHistory(decodeFromURI(this.props.forumId));
	},

	getForum () {
		return Store.getForum(this.props.forumId);
	},

	canCreateTopic () {
		let forum = this.getForum();
		return !!(forum && forum.hasLink('add'));
	},

	createTopicLink () {
		if (!this.canCreateTopic()) {
			return null;
		}
		return (
			<Link className="action-link" href="/newtopic/">
				{t('create')}
			</Link>
		);
	},

	deleteForum () {
		Prompt.areYouSure(t('deletePrompt')).then(
			() => {
				Actions.deleteForum(this.getForum());
			},
			() => {}
		);
	},

	render () {
		if (this.state.loading) {
			return <Loading.Mask />;
		}

		let { forumId, forum, contentPackage } = this.props;
		let batchStart = paging.batchStart();
		let forumContents = Store.getForumContents(forumId, batchStart, paging.getPageSize()) || forum;
		const canDelete = Store.isSimple(contentPackage.getID()) && forum.hasLink && forum.hasLink('edit');

		if (
			!forumContents ||
			(forumContents && forumContents.code === ERROR_CODE)
		) {
			return (
				<Err error="There was a problem loading the forum. Please try again later." />
			);
		}

		return (
			<div>
				<TransitionGroup>
					<Transition key="topics">
						<div>
							<ViewHeader type={FORUM} />
							<section className="topics-section">
								<ul className="action-links topics-controls">
									<li>{this.createTopicLink()}</li>
									{canDelete && (
										<li>
											<a
												className="action-link"
												onClick={this.deleteForum}
											>
												Delete
											</a>
										</li>
									)}
								</ul>
								<div className="group-heading">
									<h3>Topics</h3>
								</div>
								<TopicList container={forumContents} />
							</section>
						</div>
					</Transition>
				</TransitionGroup>
			</div>
		);
	}
});
