import React from 'react';

import t from 'nti-lib-locale';

import Breadcrumb from 'common/components/BreadcrumbPath';

import TopicHeadline from 'forums/components/TopicHeadline';
import ActionsComp from 'forums/components/Actions';

import {Prompt} from 'nti-web-commons';

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


	onDelete () {
		const {props: {item}} = this;

		Prompt.areYouSure(t('FORUMS.deleteTopicPrompt'))
			.then(() => item.delete());
	},


	render () {
		const {props: {item}} = this;

		return (
			<div>
				<Breadcrumb item={item} />
				<TopicHeadline item={item} />
				<ActionsComp item={item} onDelete={this.onDelete} />
			</div>
		);

	}
});
