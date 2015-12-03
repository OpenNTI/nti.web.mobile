import React from 'react';

export default React.createClass({
	displayName: 'GradebookColumnScore',

	statics: {
		label () {
			return 'Score';
		},
		sort: 'Grade'
	},

	propTypes: {
		item: React.PropTypes.object.isRequired // UserGradeBookSummary object
	},


	render () {
		return (
			<div>(score)</div>
		);
	}
});
