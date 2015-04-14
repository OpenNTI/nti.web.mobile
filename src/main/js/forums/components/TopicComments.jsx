'use strict';


import Api from '../Api';
import Err from 'common/components/Error';
import List from './List';
import Loading from 'common/components/TinyLoader';
import Notice from 'common/components/Notice';
import Paging from '../mixins/Paging';
import PageControls from './PageControls';
import React from 'react';
import Store from '../Store';
import Transition from 'common/thirdparty/ReactCSSTransitionWrapper';

const loadData = 'TopicComments:load';

export default React.createClass({

	mixins: [Paging],

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

	getInitialState() {
		return {
			loading: true
		};
	},

	[loadData] (topicId=this.props.topicId) {
		return Api.getTopicContents(topicId, this.batchStart(), this.getPageSize())
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

	render () {

		if (this.state.loading) {
			return <Loading />;
		}

		if (this.state.error) {
			let {error} = this.state;
			return (error || {}).statusCode === 404 ? <div><Notice>This topic could not be found.</Notice></div> : <Err error={error} />;
		}

		let topic = Store.getObject(this.props.topicId);
		let container = Store.getObjectContents(this.props.topicId);
		let pageInfo = this.pagingInfo();

		return (
			(container.Items || []).length > 0 &&
			<div>
				<section className="comments">
					<Transition transitionName="forums">
						<List className="forum-replies" container={container} {...this.props} itemProps={{topic: topic}} omitIfEmpty={true} />
					</Transition>
				</section>
				<PageControls paging={pageInfo} />
			</div>
		);
	}
});
