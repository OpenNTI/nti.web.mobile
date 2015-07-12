import React from 'react';
import TopicHeadline from 'forums/components/TopicHeadline';
import Breadcrumb from './Breadcrumb';
// import ReportLink from 'forums/components/ReportLink';
import ActionLinks, {ActionLinkConstants} from 'forums/components/ActionLinks';
import ObjectLink from './ObjectLink';
import LuckyCharms from 'common/components/LuckyCharms';
import PostEditor from '../PostEditor';
import Loading from 'common/components/TinyLoader';
import {savePost, deletePost} from '../../Api';
import {areYouSure} from 'prompts';
import t from 'common/locale';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'ForumTopic',
	mixins: [Mixin, ObjectLink],

	statics: {
		mimeType: /forums\.((.+)headlinetopic|personalblogentry)$/i
	},

	propTypes: {
		item: React.PropTypes.any.isRequired
	},

	getInitialState: function() {
		return {
			editing: false,
			busy: false
		};
	},

	toggleEdit () {
		this.setState({
			editing: !this.state.editing
		});
	},

	onSave (title, value) {
		this.setState({
			busy: true
		});
		let {item} = this.props;
		savePost(item.headline, {
			title: title,
			body: value
		})
		.then( result => {
			// update the copy we're using in the view so we don't have to reload the stream
			Object.assign(item.headline, {title: result.title, body: result.body});
			this.setState(this.getInitialState());
		});
	},

	storeChange (event) {
		console.debug(event);
	},

	deleteClicked() {
		areYouSure(t('FORUMS.deleteTopicPrompt')).then(() => {
			deletePost(this.props.item)
			.then(result => {
				console.debug(result);
			});
		});
	},

	render () {

		if (this.state.busy) {
			return <Loading />;
		}

		let handlers = {
			[ActionLinkConstants.EDIT]: this.toggleEdit,
			[ActionLinkConstants.DELETE]: this.deleteClicked
		};

		let {item} = this.props;
		if (!item) {
			return null;
		}

		if (this.state.editing) {
			return (
				<PostEditor
					title={item.headline.title}
					value={item.headline.body}
					onCancel={this.toggleEdit}
					onSubmit={this.onSave}
				/>
			);
		}

		return (
			<div>
				<Breadcrumb item={item} />
				<div className="body">
					<LuckyCharms item={item} />
					<TopicHeadline item={item.headline} />
				</div>
				<ActionLinks item={item} clickHandlers={handlers} />
				{/*
				<div className="footer">
					<a href={this.objectLink(item)} className="postCount">{t('replies', {count: item.PostCount})}</a>
					<ReportLink item={item} />
				</div>
				*/}
			</div>
		);

	}
});
