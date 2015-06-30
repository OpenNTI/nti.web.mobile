import React from 'react';
import TopicHeadline from 'forums/components/TopicHeadline';

import Breadcrumb from './Breadcrumb';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'CommunityHeadlineTopic',
	mixins: [Mixin],

	statics: {
		mimeType: /forums\.(.+)headlinetopic$/i
	},

	propTypes: {
		item: React.PropTypes.any.isRequired
	},

	render () {

		let {item} = this.props;
		if (!item) {
			return null;
		}

		return (
			<div>
				<Breadcrumb item={item} />
				<TopicHeadline item={item.headline} />
			</div>
		);

	}
});
