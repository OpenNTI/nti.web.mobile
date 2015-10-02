import React from 'react';
import DateTime from 'common/components/DateTime';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'Assignment',
	mixins: [Mixin],

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

		return (
			<div className="assignment">
				<div className="path">Lessons</div>
				<div className="title">{item.title}</div>
				<div className="footer"><DateTime date={item.getAvailableForSubmissionBeginning()} /></div>
			</div>
		);
	}
});
