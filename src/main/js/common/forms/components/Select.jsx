/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

var Select = React.createClass({

	propTypes: {
		// the list of options for the select: an array of
		// objects with name and value properties
		// or an array of strings.
		options: React.PropTypes.array
	},

	// if our options are simple strings turn them into objects
	// with name and value properties.
	_makeOption: function(option) {
		return typeof option === 'string' ? { name: option, value: option } : option;
	},

	render: function() {

		var options = this.props.options.map(function(item) {
			var option = this._makeOption(item);
			return <option value={option.value}>{option.name}</option>
		}.bind(this));

		// include empty option
		options.unshift(<option value=""></option>);

		var select = this.transferPropsTo(
			<select>
				{options}
			</select>
		);

		return (
			<label>
				<span>{this.props.field.label}</span>
				{select}
			</label>
		);
	}

});

module.exports = Select;
