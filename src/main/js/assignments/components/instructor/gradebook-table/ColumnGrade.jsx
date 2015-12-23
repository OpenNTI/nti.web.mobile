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
		item: React.PropTypes.shape({
			grade: React.PropTypes.object
		}).isRequired
	},

	render () {

		const {props: {item: {grade}}} = this;

		return (
			<div className="grade">{!!grade}</div>
		);
	}
});
