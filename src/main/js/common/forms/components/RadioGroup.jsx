import React from 'react';

export default React.createClass({
	displayName: 'RadioGroup',

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

	render: function() {
		return (
			<div className="radiogroup">
				<p>{this.props.field.label}</p>
				{this.renderOptions()}
			</div>
		);
	}

});
