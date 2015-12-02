import React from 'react';

export default React.createClass({
	displayName: 'GradebookColumnScore',

	statics: {
		label () {
			return 'Score';
		}
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
