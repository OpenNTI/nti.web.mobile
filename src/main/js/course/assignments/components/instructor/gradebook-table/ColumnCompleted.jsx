import React from 'react';

export default React.createClass({
	displayName: 'GradebookColumnCompleted',

	statics: {
		label () {
			return 'Completed';
		},
		className: 'col-completed'
	},

	propTypes: {
		item: React.PropTypes.object.isRequired // UserGradeBookSummary object
	},


	render () {
		return (
			<div>(completed)</div>
		);
	}
});
