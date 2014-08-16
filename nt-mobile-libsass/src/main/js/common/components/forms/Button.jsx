/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var Button = React.createClass({
	render: function() {
		debugger;
		return this.transferPropsTo(
			<a href="#" className='button tiny radius'>{this.props.children}</a>
		);
	}
});

module.exports = Button;