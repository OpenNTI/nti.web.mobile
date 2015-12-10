import React from 'react';

import t from 'common/locale';

import Breadcrumb from 'common/components/BreadcrumbPath';
import LuckyCharms from 'common/components/LuckyCharms';

import TopicHeadline from 'forums/components/TopicHeadline';
import ActionsComp from 'forums/components/Actions';

import {areYouSure} from 'prompts';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'ForumTopic',
	mixins: [Mixin],

	statics: {
		mimeType: /forums\.((.+)headlinetopic|personalblogentry(post)?)$/i
	},

	propTypes: {
		item: React.PropTypes.any.isRequired
	},


	componentWillMount () {
		console.log(this.props.item);
	},


	onDelete () {
		const {props: {item}} = this;

		areYouSure(t('FORUMS.deleteTopicPrompt'))
			.then(() => item.delete());
	},


	render () {
		const {props: {item}} = this;

		return (
			<div>
				<Breadcrumb item={item} />
				<div className="body">
					<LuckyCharms item={item} />
					<TopicHeadline item={item.headline || item} />
				</div>
				<ActionsComp item={item} onDelete={this.onDelete} />
			</div>
		);

	}
});
