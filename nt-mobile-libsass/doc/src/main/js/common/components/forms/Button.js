/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

/**
* React Button component
* @class Button
*/
var Button = React.createClass({displayName: 'Button',
	render: function() {
		return this.transferPropsTo(
			React.DOM.a( {href:"#", className:"button tiny radius"}, this.props.children)
		);
	}
});

module.exports = Button;
