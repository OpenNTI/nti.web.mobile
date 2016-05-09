import React from 'react';
import DatePicker from 'react-datepicker';

require('react-datepicker/dist/react-datepicker.css');

export default React.createClass({

	displayName: 'DateField',

	propTypes: {
		onChange: React.PropTypes.func,
		onBlur: React.PropTypes.func,
		name: React.PropTypes.string,
		defaultValue: React.PropTypes.any
	},

	getInitialState () {
		return {
		};
	},

	fauxEvent (value = this.state.startDate) {
		const {name} = this.props;
		return {
			target: {
				name,
				value
			}
		};
	},

	handleBlur () {
		const {onBlur} = this.props;
		if (onBlur) {
			onBlur(this.fauxEvent());
		}
	},

	handleChange (date) {
		const {onChange} = this.props;
		this.setState({
			startDate: date
		});
		if (onChange) {
			onChange(this.fauxEvent(date));
		}
	},

	render () {
		const {startDate} = this.state;
		const {defaultValue} = this.props;

		return (
			<div className="datefield">
				<DatePicker
					selected={startDate || defaultValue}
					showYearDropdown
					placeholderText="mm/dd/yyyy"
					{...this.props}
					onChange={this.handleChange}
					onBlur={this.handleBlur}/>
			</div>
		);
	}
});
