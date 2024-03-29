import path from 'path';

import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-component';

import { addHistory } from '@nti/lib-analytics';
import { scoped } from '@nti/lib-locale';
import { decodeFromURI } from '@nti/lib-ntiids';
import { StoreEventsMixin } from '@nti/lib-store';
import { Forums } from '@nti/web-discussions';
import { Error as Err, Loading, Mixins, Prompt } from '@nti/web-commons';

import * as Actions from '../Actions';
import paging from '../mixins/Paging';
import LoadForum from '../mixins/LoadForum';
import Store from '../Store';
import { FORUM, FORUM_DELETED, FORUM_DELETION_ERROR } from '../Constants';

import TopicList from './TopicList';
import ViewHeader from './widgets/ViewHeader';

const DEFAULT_TEXT = {
	create: 'Create a discussion',
	deletePrompt: 'Delete this forum?',
	deleteError: 'Forum cannot be deleted',
};

const t = scoped('forums.topic', DEFAULT_TEXT);
const Transition = x => (
	<CSSTransition appear classNames="fade-out-in" timeout={500} {...x} />
);

const ERROR_CODE = '404 Not Found';

const Topics = createReactClass({
	displayName: 'Topics',

	mixins: [Mixins.NavigatableMixin, StoreEventsMixin, LoadForum],

	propTypes: {
		forumId: PropTypes.string,
		forum: PropTypes.object,
		contentPackage: PropTypes.shape({
			getID: PropTypes.func,
		}),
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		[FORUM_DELETION_ERROR](event) {
			setTimeout(() => {
				Prompt.alert(t('deleteError'));
			}, 1000);
		},

		[FORUM_DELETED](event) {
			const discussions = path.resolve(
				this.getNavigable().getEnvironment().getPath(),
				'..'
			);
			this.navigateRoot(`${discussions}/`);
		},
	},

	getInitialState() {
		return {
			loading: true,
		};
	},

	componentWillUnmount() {
		addHistory(decodeFromURI(this.props.forumId));
	},

	getForum() {
		return Store.getForum(this.props.forumId);
	},

	canCreateTopic() {
		let forum = this.getForum();
		return !!(forum && forum.hasLink('add'));
	},

	createTopicLink() {
		if (!this.canCreateTopic()) {
			return null;
		}
		return (
			<Link className="action-link" href="/newtopic/">
				{t('create')}
			</Link>
		);
	},

	deleteForum() {
		Prompt.areYouSure(t('deletePrompt')).then(
			() => {
				Actions.deleteForum(this.getForum());
			},
			() => {}
		);
	},

	editForum() {
		this.setState({ showEditor: true });
	},

	hideEditor() {
		this.setState({ showEditor: false });
	},

	saveForum(payload) {
		this.getForum().edit(payload);

		this.hideEditor();
	},

	render() {
		const { showEditor } = this.state;

		if (this.state.loading) {
			return <Loading.Mask />;
		}

		let { forumId, forum } = this.props;
		let batchStart = paging.batchStart();
		let forumContents =
			Store.getForumContents(forumId, batchStart, paging.getPageSize()) ||
			forum;
		const canEdit = forum.hasLink && forum.hasLink('edit');

		if (
			!forumContents ||
			(forumContents && forumContents.code === ERROR_CODE)
		) {
			return (
				<Err error="There was a problem loading the forum. Please try again later." />
			);
		}

		return (
			<div className="topics-wrapper">
				<TransitionGroup>
					<Transition key="topics">
						<div>
							<ViewHeader type={FORUM} />
							<section className="topics-section">
								<ul className="action-links topics-controls">
									<li>{this.createTopicLink()}</li>
									{canEdit && (
										<li>
											<a
												className="action-link"
												onClick={this.deleteForum}
											>
												Delete
											</a>
										</li>
									)}
									{canEdit && (
										<li>
											<a
												className="action-link"
												onClick={this.editForum}
											>
												Edit
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
				{showEditor && (
					<Forums.Editor
						title={this.getForum().title}
						onBeforeDismiss={this.hideEditor}
						onSubmit={this.saveForum}
						isEditing
					/>
				)}
			</div>
		);
	},
});

export default Topics;
