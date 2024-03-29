import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Link } from 'react-router-component';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Error as Err, Loading } from '@nti/web-commons';
import { NoticePanel as Notice } from '@nti/web-core';
import { StoreEventsMixin } from '@nti/lib-store';

import Paging from '../mixins/Paging';
import { getTopicContents } from '../Api';
import { COMMENT_ADDED } from '../Constants';
import Store from '../Store';

import List from './List';
import PageControls from './PageControls';

export default createReactClass({
	displayName: 'TopicComments',

	mixins: [Paging, StoreEventsMixin],

	backingStore: Store,
	backingStoreEventHandlers: {
		[COMMENT_ADDED](event) {
			this.commentAdded(event);
		},
	},

	propTypes: {
		topicId: PropTypes.string,
		currentPage: PropTypes.number,
	},

	componentDidMount() {
		this.loadData();
	},

	componentDidUpdate(prevProps) {
		if (this.props.currentPage !== prevProps.currentPage) {
			this.setState({ loading: true });
			this.loadData();
		}
	},

	getInitialState() {
		return {
			loading: true,
			showJumpToLastPage: false,
		};
	},

	commentAdded(/*event*/) {
		this.loadData().then(() => {
			// if a comment was added and it's not on the current page
			// offer a link to get there.
			let pi = this.pagingInfo();
			if (pi.currentPage() !== pi.numPages) {
				this.showCommentAddedMessage();
			}
		});
	},

	showCommentAddedMessage(show = true) {
		this.setState({
			showJumpToLastPage: show,
		});
	},

	loadData(topicId = this.props.topicId) {
		return getTopicContents(
			topicId,
			this.batchStart(),
			this.getPageSize()
		).then(
			result => {
				Store.setForumItem(topicId, result.item);
				Store.setForumItemContents(topicId, result.contents);
				this.setState({
					item: result.item,
					itemContents: result.contents,
					loading: false,
				});
			},
			reason => {
				this.setState({
					loading: false,
					error: reason,
				});
			}
		);
	},

	jumpToLastPageMessage() {
		const { numPages: lastPage } = this.pagingInfo();
		return (
			<Notice
				className="small"
				onClick={() => this.showCommentAddedMessage(false)}
			>
				Comment added.{' '}
				<Link className="link" href={'/?p=' + lastPage}>
					Jump to last page?
				</Link>
			</Notice>
		);
	},

	render() {
		let { error, loading } = this.state;
		let { topicId } = this.props;

		if (error) {
			return (error || {}).statusCode === 404 ? (
				<div>
					<Notice>This topic could not be found.</Notice>
				</div>
			) : (
				<Err error={error} />
			);
		}

		let topic = Store.getForumItem(topicId);
		let container = Store.getForumItemContents(topicId);
		let pageInfo = this.pagingInfo();

		// console.debug('pageInfo: %o', pageInfo);

		return (
			<div>
				{loading ? (
					<Loading.Ellipse className="topic-comments" />
				) : (container.Items || []).length > 0 ? (
					<div>
						<section className="comments">
							<TransitionGroup>
								<CSSTransition
									key="replies"
									appear
									classNames="fade-out-in"
									timeout={500}
								>
									<List
										className="forum-replies"
										container={container}
										itemProps={{ topic: topic }}
									/>
								</CSSTransition>
							</TransitionGroup>
						</section>
						{this.state.showJumpToLastPage &&
							this.jumpToLastPageMessage()}
						<PageControls paging={pageInfo} />
					</div>
				) : null}
			</div>
		);
	},
});
