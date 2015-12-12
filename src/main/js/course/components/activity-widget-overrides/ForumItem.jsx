import React from 'react';

import Avatar from 'common/components/Avatar';
import DateTime from 'common/components/DateTime';
import DisplayName from 'common/components/DisplayName';
import Breadcrumb from 'common/components/BreadcrumbPath';
import LuckyCharms from 'common/components/LuckyCharms';
import Report from 'common/components/Report';

import TopicHeadline from 'forums/components/TopicHeadline';
// import ActionsComp from 'forums/components/Actions';

import {Panel as ModeledContentPanel} from 'modeled-content';

import AddComment from './AddComment';

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
			<div className="course-forum-activity">
				<Breadcrumb item={item} breadcrumb={PREFIX} splicePaths={1}/>
				<div className="body">
					<LuckyCharms item={item} />
					<TopicHeadline item={item.headline || item} />
				</div>
				<div>Read More · 3 Comments</div>
				<div className="replies">
					{item.NewestDescendant && (
						<Comment item={item.NewestDescendant}/>
					)}
				</div>
				<AddComment item={item}/>
			</div>
		);

	}
});


function Comment (props) {
	const {item} = props;
	return (
		<div className="post comment">
			<Avatar entity={item.creator}/>
			<div className="meta">
				<DisplayName entity={item.creator}/>{" · "}<DateTime date={item.getCreatedTime()} relative/>
			</div>
			<ModeledContentPanel body={item.body} />
			Reply · <Report item={item}/>
		</div>
	);
}
Comment.propTypes = {item: React.PropTypes.object};
