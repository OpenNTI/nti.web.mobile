import './RadioGroup.scss';
import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

export default class extends React.Component {
	static displayName = 'RadioGroup';

	static propTypes = {
		defaultValue: PropTypes.any,

		field: PropTypes.shape({
			label: PropTypes.string,
		}).isRequired,

		options: PropTypes.arrayOf(
			PropTypes.shape({
				label: PropTypes.string,
				value: PropTypes.string,
			})
		),

		name: PropTypes.string,

		className: PropTypes.string,

		value: PropTypes.any,
	};

	renderOptions = () => {
		return (this.props.options || []).map((option, index) => {
			let value = this.props.value || this.props.defaultValue;
			let checked = value && value === option.value;
			let id = [this.props.name, option.value].join(':');
			return (
				<label className="radio" key={'option' + index} htmlFor={id}>
					<input
						{...this.props}
						type="radio"
						id={id}
						name={this.props.name}
						checked={checked}
						value={option.value}
					/>
					<span className="htmlLabel">{option.label}</span>
				</label>
			);
		});
	};

	render() {
		const { field, className } = this.props;

		let classes = cx('radiogroup', className);

		return (
			<div className={classes}>
				<p>{field.label}</p>
				{this.renderOptions()}
			</div>
		);
	}
}
