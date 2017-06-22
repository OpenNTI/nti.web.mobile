import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Link} from 'react-router-component';
import Transition from 'react-transition-group/CSSTransitionGroup';
import {Error as Err, Loading, Notice} from 'nti-web-commons';
import {StoreEventsMixin} from 'nti-lib-store';

import Paging from '../mixins/Paging';
import {getTopicContents} from '../Api';
import {COMMENT_ADDED} from '../Constants';
import Store from '../Store';

import List from './List';
import PageControls from './PageControls';


const loadData = 'TopicComments:load';
const commentAdded = 'TopicComments:commentAdded';
const showCommentAddedMessage = 'TopicComments:showCommentAddedMessage';
const showJumpToLastPage = 'TopicComments:showJumpToLastPage';

export default createReactClass({
	displayName: 'TopicComments',

	mixins: [Paging, StoreEventsMixin],

	backingStore: Store,
	backingStoreEventHandlers: {
		[COMMENT_ADDED] (event) {
			this[commentAdded](event);
		}
	},

	propTypes: {
		topicId: PropTypes.string,
		currentPage: PropTypes.number
	},

	componentDidMount () {
		this[loadData]();
	},

	componentWillReceiveProps (nextProps) {
		if (this.props.currentPage !== nextProps.currentPage) {
			this.setState({
				loading: true
			});
			this[loadData]();
		}
	},

	getInitialState () {
		return {
			loading: true,
			[showJumpToLastPage]: false
		};
	},

	[commentAdded] (/*event*/) {
		this[loadData]()
			.then(() => {
				// if a comment was added and it's not on the current page
				// offer a link to get there.
				let pi = this.pagingInfo();
				if (pi.currentPage() !== pi.numPages) {
					this[showCommentAddedMessage]();
				}
			});
	},

	[showCommentAddedMessage] () {
		this.setState({
			[showJumpToLastPage]: true
		});
	},

	[loadData] (topicId = this.props.topicId) {
		return getTopicContents(topicId, this.batchStart(), this.getPageSize())
			.then(
				result => {
					Store.setForumItem(topicId, result.item);
					Store.setForumItemContents(topicId, result.contents);
					this.setState({
						item: result.item,
						itemContents: result.contents,
						loading: false
					});
				},
				reason => {
					this.setState({
						loading: false,
						error: reason
					});
				}
			);
	},

	jumpToLastPageMessage () {
		let lastPage = this.pagingInfo().numPages;
		return <Notice className="small">Comment added. <Link className="link" href={'/?p=' + lastPage}>Jump to last page?</Link></Notice>;
	},

	render () {
		let {error, loading} = this.state;
		let {topicId} = this.props;

		if (error) {
			return (error || {}).statusCode === 404 ? <div><Notice>This topic could not be found.</Notice></div> : <Err error={error} />;
		}

		let topic = Store.getForumItem(topicId);
		let container = Store.getForumItemContents(topicId);
		let pageInfo = this.pagingInfo();

		// console.debug('pageInfo: %o', pageInfo);

		return (
			<div>
				{loading ? (
					<Loading.Ellipse className="topic-comments"/>
				) : (container.Items || []).length > 0 ? (
					<div>
						<section className="comments">
							<Transition transitionName="fadeOutIn"
								transitionAppear
								transitionAppearTimeout={500}
								transitionEnterTimeout={500}
								transitionLeaveTimeout={500}
							>
								<List className="forum-replies" container={container} itemProps={{topic: topic}} />
							</Transition>
						</section>
						{this.state[showJumpToLastPage] && this.jumpToLastPageMessage()}
						<PageControls paging={pageInfo} />
					</div>
				) :
					null
				}
			</div>
		);
	}
});
