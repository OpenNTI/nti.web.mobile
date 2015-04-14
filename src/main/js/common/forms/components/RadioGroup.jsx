import React from 'react';

export default React.createClass({
	displayName: 'RadioGroup',

	renderOptions () {
		return (this.props.options || []).map((option, index) => {
			let value = this.props.value || this.props.defaultValue;
			let checked = value && value === option.value;

			return (
				<label key={'option' + index}>
					<input {...this.props} type="radio"
								name={this.props.name}
								checked={checked}
								value={option.value} />
					<span>{option.label}</span>
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
