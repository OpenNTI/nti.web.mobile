import React from 'react';

import Breadcrumb from 'common/components/BreadcrumbPath';
import LuckyCharms from 'common/components/LuckyCharms';

import TopicHeadline from 'forums/components/TopicHeadline';
// import ActionsComp from 'forums/components/Actions';


const PREFIX = [];

export default React.createClass({
	displayName: 'ForumItem',

	statics: {
		handles (item) {
			const {MimeType = ''} = item;
			return /topic$/i.test(MimeType);
		}
	},


	propTypes: {
		item: React.PropTypes.any.isRequired
	},


	render () {
		const {props: {item}} = this;

		return (
			<div>
				<Breadcrumb item={item} breadcrumb={PREFIX} splicePaths={1}/>
				<div className="body">
					<LuckyCharms item={item} />
					<TopicHeadline item={item.headline || item} />
				</div>
				{/*<ActionsComp item={item} /> */}
			</div>
		);

	}
});
