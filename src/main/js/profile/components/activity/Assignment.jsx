import React from 'react';
import cx from 'classnames';

import DateTime from 'common/components/DateTime';
import {scoped} from 'common/locale';

import ObjectLink from './ObjectLink';
import Mixin from './Mixin';



let t = scoped('UNITS');

export default React.createClass({
	displayName: 'Assignment',
	mixins: [Mixin, ObjectLink],

	statics: {
		mimeType: /assessment\.assignment/i
	},

	propTypes: {
		item: React.PropTypes.any.isRequired
	},

	render () {

		let {item} = this.props;
		if (!item) {
			return null;
		}

		let href = this.objectLink(item);

		let classes = cx('assignment', {
			overdue: item.isLate(new Date()) && !item.hasSubmission
		});

		return (
			<div className={classes}>
				<a href={href}>
					<div className="path">Assignments</div>
					<div className="title">{item.title}</div>
					<div className="bullets">{t('questions', {count: item.getQuestionCount()})}</div>
					<div className="footer"><DateTime date={item.getAvailableForSubmissionBeginning()} /></div>
				</a>
			</div>
		);
	}
});
