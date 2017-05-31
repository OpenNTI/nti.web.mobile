import PropTypes from 'prop-types';
import React from 'react';

import Avatar from 'common/components/Avatar';
import Breadcrumb from 'common/components/BreadcrumbPath';
import {DateTime} from 'nti-web-commons';
import DisplayName from 'common/components/DisplayName';
import GotoItem from 'common/components/GotoItem';
import {Report} from 'nti-web-commons';

import t from 'nti-lib-locale';

import TopicHeadline from 'forums/components/TopicHeadline';
// import ActionsComp from 'forums/components/Actions';

import {Panel as ModeledContentPanel} from 'modeled-content';

import AddComment from './AddComment';


const PREFIX = [];

export default class extends React.Component {
	static displayName = 'ForumItem';

	static handles (item) {
		const {MimeType = ''} = item;
		return /topic$/i.test(MimeType);
	}

	static propTypes = {
		item: PropTypes.any.isRequired
	};

	render () {
		const {props: {item}} = this;

		return (
			<div className="course-forum-activity">
				<Breadcrumb item={item} breadcrumb={PREFIX} splicePaths={1}/>
				<TopicHeadline item={item} />

				<ul className="action-links">
					<li className="action-link"><GotoItem item={item}>{t('ACTIVITY.goto')}</GotoItem></li>
					<li className="">{t('UNITS.comments', {count: item.PostCount})}</li>
				</ul>

				<div className="replies">
					{item.NewestDescendant && (
						<Comment item={item.NewestDescendant}/>
					)}
				</div>
				<AddComment item={item}/>
			</div>
		);

	}
}


function Comment (props) {
	const {item} = props;
	return (
		<div className="post comment">
			<Avatar entity={item.creator}/>
			<div className="meta">
				<DisplayName entity={item.creator}/>{' · '}<DateTime date={item.getCreatedTime()} relative/>
			</div>
			<ModeledContentPanel body={item.body} />
			<ul className="action-links">
				<li className="action-link"><GotoItem item={item}>{t('DISCUSSIONS.ACTIONS.reply')}</GotoItem></li>
				<li className="action-link"><Report item={item}/></li>
			</ul>
		</div>
	);
}
Comment.propTypes = {item: PropTypes.object};
