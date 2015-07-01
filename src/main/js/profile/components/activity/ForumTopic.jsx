import React from 'react';
import TopicHeadline from 'forums/components/TopicHeadline';
import Breadcrumb from './Breadcrumb';
import ReportLink from 'forums/components/ReportLink';
import ObjectLink from './ObjectLink';
import {scoped} from 'common/locale';
let t = scoped('FORUMS');

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'CommunityHeadlineTopic',
	mixins: [Mixin, ObjectLink],

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
				<div className="footer">
					<a href={this.objectLink(item)} className="postCount">{t('replies', {count: item.PostCount})}</a>
					<ReportLink item={item} />
				</div>
			</div>
		);

	}
});
