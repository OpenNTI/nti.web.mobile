import React from 'react';
import cx from 'classnames';

import {scoped} from 'common/locale';

import Footer from './AssignmentFooter';

import ObjectLink from './ObjectLink';
import Mixin from './Mixin';
import AssignmentHistoryContextChild from 'course/mixins/AssignmentHistoryContextChild';

let t = scoped('UNITS');

export default React.createClass({
	displayName: 'Assignment',
	mixins: [Mixin, ObjectLink, AssignmentHistoryContextChild],

	statics: {
		mimeType: /assessment\.assignment/i
	},

	propTypes: {
		item: React.PropTypes.any.isRequired,
		className: React.PropTypes.any
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
					<div className="card-title">{item.title}</div>
					<div className="bullets">{t('questions', {count: item.getQuestionCount()})}</div>
					<Footer assignment={item} history={history} />
				</a>
			</div>
		);
	}
});
