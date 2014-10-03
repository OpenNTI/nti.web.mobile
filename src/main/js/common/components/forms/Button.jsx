/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

/**
* React Button component
* @class Button
*/
var Button = React.createClass({

	getDefaultProps: function() {
		return {
			href: '#'
		};
	},

	onClick: function(e) {
		(this.props.onClick||function(){}).apply(this,arguments);
		if(this.props.href==='#') {
			e.preventDefault();
		}
	},

	render: function() {
		return this.transferPropsTo(
			<a href={this.props.href} onClick={this.onClick} className='button tiny radius'>{this.props.children}</a>
		);
	}
});

module.exports = Button;
