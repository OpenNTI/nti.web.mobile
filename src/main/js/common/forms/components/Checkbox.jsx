/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

var Checkbox = React.createClass({

	propTypes: {
		field: React.PropTypes.object.isRequired
	},

	render: function() {

		var input = this.transferPropsTo(<input />);
		var config = this.props.field||{};

		var labelSpan = config.htmlLabel ?
			<span className='htmlLabel' dangerouslySetInnerHTML={{__html: config.label}} /> :
			<span>{config.label}</span>;

		return (
			<label>{input}{labelSpan}</label>
		);
	}

});

module.exports = Checkbox;
