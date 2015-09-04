import React from 'react';
import cx from 'classnames';

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
		let {value, options} = this.props;
		this.setSelected(value || options[0].value);
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

	toggle () {
		this.state.isOpen ? this.close() : this.open();
	},

	render () {

		let {isOpen, selectedOption} = this.state;

		let classes = cx('select-box', {'open': isOpen});
		let Tag = 'div';

		let selectedItem = <li className="selected" onClick={this.toggle}>{selectedOption.label}</li>;

		if (isOpen) {
			return (
				<Tag className={classes}>
					<ul>
					{selectedItem}
					{this.props.options.filter(item => item !== selectedOption).map((option, index) =>
						<li key={index} onClick={this.onClick.bind(this, option.value || option.label)}>{option.label}</li>
					)}
					</ul>
				</Tag>
			);
		}
		return (
			<Tag className={classes}>
				<ul>
					{selectedItem}
				</ul>
			</Tag>
		);
	}
});
