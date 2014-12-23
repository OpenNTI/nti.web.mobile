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
			href: '#',
			enabled: true
		};
	},

	onClick: function(e) {
		if(this.props.enabled) {
			(this.props.onClick||function(){}).apply(this,arguments);
		}
		if(this.props.href==='#' || !this.props.enabled) {
			e.preventDefault();
		}
	},

	render: function() {

		var css = ['button', 'tiny', 'radius'];
		css.push(this.props.className);
		if(!this.props.enabled) {
			css.push('disabled');
		}
		return (
			<a {...this.props} href={this.props.href} onClick={this.onClick} className={css.join(' ')}>
				{this.props.children}
			</a>
		);
	}
});

module.exports = Button;
