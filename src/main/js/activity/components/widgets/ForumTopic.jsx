import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import t from 'nti-lib-locale';
import {Prompt} from 'nti-web-commons';

import Breadcrumb from 'common/components/BreadcrumbPath';
import TopicHeadline from 'forums/components/TopicHeadline';
import ActionsComp from 'forums/components/Actions';

import Mixin from './Mixin';

export default createReactClass({
	displayName: 'ForumTopic',
	mixins: [Mixin],

	statics: {
		mimeType: /forums\.((.+)headlinetopic|personalblogentry(post)?)$/i
	},

	propTypes: {
		item: PropTypes.any.isRequired
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
