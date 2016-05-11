import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';


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

	/*
	 * NTI-907 - Under iOS if the input remains focused after selecting a date then tapping the input again
	 * doesn't bring the picker back. So we're forcing the input to blur.
	 */
	blurInput () {
		if (this.datePicker) {
			const node = ReactDOM.findDOMNode(this.datePicker);
			const input = node.querySelector('input');
			setTimeout(() => input.blur(), 10);
		}
	},

	handleChange (date) {
		const {onChange} = this.props;
		this.setState({
			startDate: date
		});
		this.blurInput();
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
					ref={x => this.datePicker = x}
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
