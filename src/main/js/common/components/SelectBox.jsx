import React from 'react';

export default React.createClass({
	displayName: 'SelectBox',

	propTypes: {
		options: React.PropTypes.array.isRequired,
		value: React.PropTypes.any,
		onChange: React.PropTypes.func
	},

	getInitialState () {
		return {
			isOpen: false
		};
	},

	componentWillMount () {
		let {value} = this.props;
		this.setSelected(value);
	},

	setSelected (value) {
		let {options, onChange} = this.props;
		let selectedOption = value ? options.find(option => option.value === value) : options[0];
		this.setState({
			selectedOption
		});
		if(onChange) {
			onChange(value);
		}
	},

	onClick (value) {
		this.setSelected(value);
		this.close();
	},

	open () {
		this.setState({
			isOpen: true
		});
	},

	close () {
		this.setState({
			isOpen: false
		});
	},

	render () {

		let {isOpen, selectedOption} = this.state;

		if (isOpen) {
			return (
				<ul className="select-box">
					{this.props.options.map((option, index) => <li key={index} onClick={this.onClick.bind(this, option.value || option.label)}>{option.label}</li>)}
				</ul>
			);
		}
		return (
			<ul className="select-box">
				<li onClick={this.open}>{selectedOption.label}</li>
			</ul>
		);
	}
});
