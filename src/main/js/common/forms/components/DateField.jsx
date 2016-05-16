import React from 'react';
import zpad from 'zpad';
import range from 'array-range';

import DateFieldSelect from './DateFieldSelect';

const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

export default React.createClass({
	displayName: 'DateField',

	getInitialState () {
		return {
		};
	},

	propTypes: {
		name: React.PropTypes.string,
		onChange: React.PropTypes.func,
		field: React.PropTypes.object
	},

	onSelectChange (event) {
		const {onChange, name} = this.props;
		this.setState({
			[event.name]: event.value
		}, () => {
			if(onChange) {
				onChange({
					target: {
						name: name,
						value: this.composeValue()
					}
				});
			}
		});
	},

	monthSelect () {
		return (
			<DateFieldSelect name="month" onChange={this.onSelectChange} className="date-field-month" defaultValue="">
			<option key="month" value="" disabled>Month</option>
				{MONTHS.map( (month, i) => (<option key={month} value={i + 1}>{month}</option>) )}
			</DateFieldSelect>
		);
	},

	daySelect () {
		return (
			<DateFieldSelect name="day" onChange={this.onSelectChange} className="date-field-day" defaultValue="">
				<option key="day" value="" disabled>Day</option>
				{range(1, 32).map( (n) => (<option key={n} value={n}>{n}</option>) )}
			</DateFieldSelect>
		);
	},

	yearSelect () {
		return (
			<DateFieldSelect name="year" onChange={this.onSelectChange} className="date-field-year" defaultValue="">
				<option key="year" value="" disabled>Year</option>
				{range(1900, (new Date().getFullYear() + 1)).reverse().map((n) => (<option key={n} value={n}>{n}</option>) )}
			</DateFieldSelect>
		);
	},

	composeValue () {
		const {month, day, year} = this.state;
		const isValid = (v) => v > 0;
		return [month, day, year].every(isValid) ? `${year}-${zpad(month, 2)}-${zpad(day, 2)}` : '';
	},

	render () {
		const {name, field} = this.props;
		return (
			<div className="date-field-wrapper">
				{field && field.label && (<label><span>{field.label}</span></label>)}
				<div className="date-field-inputs">
					{this.monthSelect()}
					{this.daySelect()}
					{this.yearSelect()}
					<input name={name} type="hidden" value={this.composeValue()} />
				</div>
			</div>
		);
	}
});