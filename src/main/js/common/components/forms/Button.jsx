/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

/**
* React Button component
* @class Button
*/
var Button = React.createClass({
	render: function() {
		return this.transferPropsTo(
			<a href={this.props.href||'#'} className='button tiny radius'>{this.props.children}</a>
		);
	}
});

module.exports = Button;
