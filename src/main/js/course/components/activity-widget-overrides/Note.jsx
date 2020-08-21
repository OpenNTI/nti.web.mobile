import './Note.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import Breadcrumb from 'common/components/BreadcrumbPath';
import GotoItem from 'common/components/GotoItem';
import Context from 'content/components/discussions/Context';
import Detail from 'content/components/discussions/Detail';

import AddComment from './AddComment';

const t = scoped('activity.item', {
	goto: 'Read More'
});

const PREFIX = ['Lessons'];

export default class extends React.Component {
	static displayName = 'course:activity:Note';

	static handles (item) {
		return /note$/i.test(item.MimeType);
	}

	static propTypes = {
		item: PropTypes.object.isRequired
	};

	render () {
		const {props: {item}} = this;
		return (
			<div className="course-note-activity">
				<Breadcrumb item={item} breadcrumb={PREFIX} splicePaths={1}/>
				<Context item={item} className="activity"/>
				<Detail item={item} lite/>

				<ul className="action-links">
					<li className="action-link"><GotoItem item={item}>{t('goto')}</GotoItem></li>
					<li className="">{t('common.units.comments', {count: item.replyCount})}</li>
				</ul>

				<AddComment item={item}/>
			</div>
		);
	}
}
