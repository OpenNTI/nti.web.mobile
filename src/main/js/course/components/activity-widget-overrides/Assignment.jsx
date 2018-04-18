import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {Ellipsed} from '@nti/web-commons';

import ObjectLink from 'common/mixins/ObjectLink';

import AssignmentHistoryContextChild from '../../mixins/AssignmentHistoryContextChild';

import Footer from './AssignmentFooter';

const t = scoped('common.units');


export default createReactClass({
	displayName: 'Assignment',
	mixins: [ObjectLink, AssignmentHistoryContextChild],

	statics: {
		handles (item) {
			return /assessment\.(timed)?assignment/i.test(item.MimeType);
		}
	},

	propTypes: {
		item: PropTypes.any.isRequired,
		className: PropTypes.any
	},

	render () {

		let {item} = this.props;
		if (!item) {
			return null;
		}

		let history = this.getAssignmentHistoryItem(item.getID());

		let href = this.objectLink(item);

		let classes = cx('assignment', this.props.className, {
			overdue: item.isLate(new Date()) && !item.hasSubmission
		});

		let path = ['Assignments'];
		if( item.outlineNode ) {
			path.push(item.outlineNode.title);
		}

		return (
			<div className={classes}>
				<a href={href}>
					<div className="path">{path.join(' / ')}</div>
					<Ellipsed className="card-title">{item.title}</Ellipsed>
					<div className="bullets">{t('questions', {count: item.getQuestionCount()})}</div>
					<Footer assignment={item} history={history} />
				</a>
			</div>
		);
	}
});
