import PropTypes from 'prop-types';
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

// month is 1-based (january = 1, december = 12)
const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

export default class extends React.Component {
	static displayName = 'DateField';

	static propTypes = {
		name: PropTypes.string,
		onChange: PropTypes.func,
		field: PropTypes.object,
		defaultValue: PropTypes.string
	};

	state = {
	};

	componentDidMount () {
		this.setup();
	}

	componentDidUpdate (prevProps) {
		if (this.props.defaultValue !== prevProps.defaultValue) {
			this.setup();
		}
	}

	setup = (props = this.props) => {
		const {defaultValue} = props;
		if (defaultValue) {
			// (yyyy)-(mm)-(dd)
			const re = /^([\d]{4})-([\d]{2})-([\d]{2})$/;
			try {
				const [, year, month, day] = defaultValue.match(re);
				this.setState({
					year,
					month,
					day
				});
			}
			catch (e) {
				// defaultValue was not in the expected format;
				this.setToToday();
			}
		}
		else {
			this.setToToday();
		}
	};

	setToToday = () => {
		const today = new Date();
		this.setState({
			year: today.getFullYear(),
			month: zpad(today.getMonth() + 1),
			day: zpad(today.getDate())
		});
	};

	onSelectChange = (event) => {
		const {onChange, name} = this.props;

		// ensure that we keep the 'day' in range for the currently selected month
		// and year. (if the user switches from 'may' to 'february' make sure we don't end
		// up with february 31 selected.)
		let newState = { ...this.state, [event.name]: event.value};
		newState.day = zpad(Math.min(newState.day, daysInMonth(newState.month, newState.year)));

		this.setState(newState, () => {
			if(onChange) {
				onChange({
					target: {
						name: name,
						value: this.composeValue()
					}
				});
			}
		});
	};

	monthSelect = () => {
		const {month} = this.state;
		return (
			<DateFieldSelect name="month" onChange={this.onSelectChange} className="date-field-month" value={month}>
				<option key="month" value="" disabled>Month</option>
				{MONTHS.map( (m, i) => (<option key={m} value={zpad(i + 1)}>{m}</option>) )}
			</DateFieldSelect>
		);
	};

	daySelect = () => {

		const {day, year, month} = this.state;

		return (
			<DateFieldSelect name="day" onChange={this.onSelectChange} className="date-field-day" value={day}>
				<option key="day" value="" disabled>Day</option>
				{range(1, daysInMonth(month, year) + 1).map( (n) => (<option key={n} value={zpad(n)}>{n}</option>) )}
			</DateFieldSelect>
		);
	};

	yearSelect = () => {
		const {year = ''} = this.state;
		return (
			<DateFieldSelect name="year" onChange={this.onSelectChange} className="date-field-year" value={year}>
				<option key="year" value="" disabled>Year</option>
				{range(1900, (new Date().getFullYear() + 1)).reverse().map((n) => (<option key={n} value={n}>{n}</option>) )}
			</DateFieldSelect>
		);
	};

	composeValue = () => {
		const {month, day, year} = this.state;
		const isValid = (v) => v > 0;
		return [month, day, year].every(isValid) ? `${year}-${zpad(month, 2)}-${zpad(day, 2)}` : '';
	};

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
}
