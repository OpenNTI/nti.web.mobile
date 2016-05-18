import React from 'react';
import cx from 'classnames';

export default React.createClass({
	displayName: 'RadioGroup',

	propTypes: {
		defaultValue: React.PropTypes.any,

		field: React.PropTypes.shape({
			label: React.PropTypes.string
		}).isRequired,

		options: React.PropTypes.arrayOf(
				React.PropTypes.shape({
					label: React.PropTypes.string,
					value: React.PropTypes.string
				})),

		name: React.PropTypes.string,

		className: React.PropTypes.string,

		value: React.PropTypes.any
	},

	renderOptions () {
		return (this.props.options || []).map((option, index) => {
			let value = this.props.value || this.props.defaultValue;
			let checked = value && value === option.value;
			let id = [this.props.name, option.value].join(':');
			return (
				<label className="radio" key={'option' + index} htmlFor={id}>
					<input {...this.props} type="radio"
								id={id}
								name={this.props.name}
								checked={checked}
								value={option.value} />
					<span className="htmlLabel">{option.label}</span>
				</label>
			);
		});
	},

	render () {

		const {field, className} = this.props;

		let classes = cx('radiogroup', className);

		return (
			<div className={classes}>
				<p>{field.label}</p>
				{this.renderOptions()}
			</div>
		);
	}

});