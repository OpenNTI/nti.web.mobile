/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

var RadioGroup = React.createClass({

	_renderOptions: function() {
		return (this.props.options||[]).map(function(option, index) {
			var input = this.transferPropsTo(<input type="radio"
						name={this.props.ref}
						value={option.value} />); 
			return <label key={'option' + index}>{input}<span>{option.label}</span></label>;
		}.bind(this));
	},

	render: function() {
		return (
			<div className="radiogroup">
				<p>{this.props.field.label}</p>
				{this._renderOptions()}
			</div>
		);
	}

});

module.exports = RadioGroup;
