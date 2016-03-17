import React from 'react';
import cx from 'classnames';

import SelectBoxItem from './SelectBoxItem';

export default React.createClass({
	displayName: 'SelectBox',

	propTypes: {
		options: React.PropTypes.array.isRequired,
		value: React.PropTypes.any,
		onChange: React.PropTypes.func,
		className: React.PropTypes.string
	},

	getInitialState () {
		return {
			isOpen: false
		};
	},

	componentWillMount () {
		let {value, options} = this.props;
		this.setSelected(value || options[0].value, true);
	},

	componentWillReceiveProps (nextProps) {
		let {value, options} = nextProps;
		this.setSelected(value || options[0].value, true);
	},

	setSelected (value, silent) {
		let {options, onChange} = this.props;
		let selectedOption = value ? options.find(option => option.value === value) : options[0];
		this.setState({
			selectedOption
		});

		if(!silent && onChange) {
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

	toggle () {
		this.state.isOpen ? this.close() : this.open();
	},

	render () {

		let {isOpen, selectedOption} = this.state;

		let classes = cx('select-box', this.props.className, {'open': isOpen});

		const optionLabel = (text) => <span className="option-label">{text}</span>;
		// let selectedItem = <li className="selected" onClick={this.toggle}><span className="option-label">{selectedOption.label}</span></li>;

		return (
			<div className={classes}>
				<div className="menu-label selected" onClick={this.toggle}>{optionLabel(selectedOption.label)}</div>
				{isOpen && (
					<ul>
						{this.props.options.filter(item => item !== selectedOption).map((option, index) =>
							<SelectBoxItem key={index} option={option} onClick={this.onClick} />
						)}
					</ul>
				)}
			</div>
		);

	}
});
