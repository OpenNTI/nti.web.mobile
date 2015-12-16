import React from 'react';

export default React.createClass({
	displayName: 'performance:ColumnFeedback',

	statics: {
		label () {
			return 'Feedback';
		},
		className: 'col-feedback',
		sort: 'feedbackCount'
	},

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {

		const {item} = this.props;

		return (
			<div>{item.feedbackCount > 0 && item.feedbackCount}</div>
		);
	}
});
