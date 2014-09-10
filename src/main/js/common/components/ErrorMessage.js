/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var ErrorMessage = React.createClass({

	render: function() {
		return (
			<div className="message error">{this.props.children}</div>
		);
	}

});

module.exports = ErrorMessage;
