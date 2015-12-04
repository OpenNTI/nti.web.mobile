import React from 'react';

export default React.createClass({
	displayName: 'GradebookColumnScore',

	statics: {
		label () {
			return 'Score';
		},
		className: 'col-score',
		sort: 'Grade'
	},

	propTypes: {
		item: React.PropTypes.object.isRequired // UserGradeBookSummary object
	},

	onFocus (e) {
		e.target.select();
	},

	onBlur (e) {
		const {value} = e.target;
		const existingValue = this.gradeValue();
		if (existingValue !== value) {
			this.gradeChanged(value);
		}
	},

	gradeChanged (newValue) {
		console.debug('grade changed', newValue);
	},

	gradeValue () {
		const {props: {item: {HistoryItemSummary}}} = this;
		return HistoryItemSummary && HistoryItemSummary.grade.value;
	},

	render () {
		return (
			<div>
				<input
					defaultValue={this.gradeValue()}
					onBlur={this.onBlur}
					onFocus={this.onFocus}
				/>
			</div>
		);
	}
});
