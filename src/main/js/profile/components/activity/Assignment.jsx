import React from 'react';

import DateTime from 'common/components/DateTime';
import {scoped} from 'common/locale';

import ObjectLink from './ObjectLink';
import Mixin from './Mixin';


let t = scoped('UNITS')

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

		return (
			<div className="assignment">
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
