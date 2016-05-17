import React from 'react';

import Breadcrumb from 'common/components/BreadcrumbPath';
import GotoItem from 'common/components/GotoItem';

import t from 'nti-lib-locale';

import Context from 'content/components/discussions/Context';
import Detail from 'content/components/discussions/Detail';

import AddComment from './AddComment';

const PREFIX = ['Lessons'];

export default React.createClass({
	displayName: 'course:activity:Note',

	statics: {
		handles (item) {
			return /note$/i.test(item.MimeType);
		}
	},


	propTypes: {
		item: React.PropTypes.object.isRequired
	},


	render () {
		const {props: {item}} = this;
		return (
			<div className="course-note-activity">
				<Breadcrumb item={item} breadcrumb={PREFIX} splicePaths={1}/>
				<Context item={item} className="activity"/>
				<Detail item={item} lite/>

				<ul className="action-links">
					<li className="action-link"><GotoItem item={item}>{t('ACTIVITY.goto')}</GotoItem></li>
					<li className="">{t('UNITS.comments', {count: item.replyCount})}</li>
				</ul>

				<AddComment item={item}/>
			</div>
		);
	}
});
