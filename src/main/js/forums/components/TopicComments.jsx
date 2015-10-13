import React from 'react';
import {Link} from 'react-router-component';

import Transition from 'react-addons-css-transition-group';

import Err from 'common/components/Error';
import Loading from 'common/components/TinyLoader';
import Notice from 'common/components/Notice';
import StoreEvents from 'common/mixins/StoreEvents';

import Paging from '../mixins/Paging';

import List from './List';
import PageControls from './PageControls';

import {getTopicContents} from '../Api';
import {COMMENT_ADDED} from '../Constants';
import Store from '../Store';

const loadData = 'TopicComments:load';
const commentAdded = 'TopicComments:commentAdded';
const showCommentAddedMessage = 'TopicComments:showCommentAddedMessage';
const showJumpToLastPage = 'TopicComments:showJumpToLastPage';

export default React.createClass({
	displayName: 'TopicComments',

	mixins: [Paging, StoreEvents],

	backingStore: Store,
	backingStoreEventHandlers: {
		[COMMENT_ADDED] (event) {
			this[commentAdded](event);
		}
	},

	propTypes: {
		topicId: React.PropTypes.string,
		currentPage: React.PropTypes.number
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
					Store.setObject(topicId, result.object);
					Store.setObjectContents(topicId, result.contents);
					this.setState({
						item: result.object,
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

		let topic = Store.getObject(topicId);
		let container = Store.getObjectContents(topicId);
		let pageInfo = this.pagingInfo();

		// console.debug('pageInfo: %o', pageInfo);

		return (
			<div>
				{loading ? (
					<Loading className="topic-comments"/>
				) : (container.Items || []).length > 0 ? (
					<div>
						<section className="comments">
							<Transition transitionName="fadeOutIn" transitionAppear>
								<List className="forum-replies" container={container} {...this.props} itemProps={{topic: topic}} omitIfEmpty />
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
