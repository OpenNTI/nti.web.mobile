import React from 'react';

export default React.createClass({
	displayName: 'GradebookColumnGrade',

	statics: {
		label () {
			return 'Grade';
		},
		className: 'col-grade',
		sort: 'Grade'
	},

	propTypes: {
		item: React.PropTypes.object.isRequired // UserGradeBookSummary object
	},

	render () {

		const {props: {item: {grade}}} = this;

		return (
			<div className="grade">{grade}</div>
		);
	}
});
