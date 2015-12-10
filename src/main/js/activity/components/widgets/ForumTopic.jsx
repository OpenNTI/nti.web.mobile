import React from 'react';

import t from 'common/locale';
import ObjectLink from 'common/mixins/ObjectLink';
import LuckyCharms from 'common/components/LuckyCharms';
import Loading from 'common/components/TinyLoader';
import Breadcrumb from 'common/components/BreadcrumbPath';

import TopicHeadline from 'forums/components/TopicHeadline';
import ActionsComp from 'forums/components/Actions';

import {areYouSure} from 'prompts';

import PostEditor from '../PostEditor';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'ForumTopic',
	mixins: [Mixin, ObjectLink],

	statics: {
		mimeType: /forums\.((.+)headlinetopic|personalblogentry(post)?)$/i
	},

	propTypes: {
		item: React.PropTypes.any.isRequired
	},

	getInitialState () {
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

	onSave (title, body) {
		this.setState({
			busy: true
		});
		let {item} = this.props;
		(item.headline || item)
			.save({title, body})
			.then(() => this.setState(this.getInitialState()));
	},

	storeChange (event) {
		console.debug(event);
	},

	deleteClicked () {
		areYouSure(t('FORUMS.deleteTopicPrompt')).then(() =>
			this.props.item.delete());
	},

	render () {

		if (this.state.busy) {
			return <Loading />;
		}

		let {item} = this.props;
		if (!item) {
			return null;
		}

		if (this.state.editing) {
			return (
				<PostEditor
					title={(item.headline || item).title}
					value={(item.headline || item).body}
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
					<TopicHeadline item={item.headline || item} />
				</div>
				<ActionsComp item={item} onDelete={this.deleteClicked} onEdit={this.toggleEdit} />
			</div>
		);

	}
});
