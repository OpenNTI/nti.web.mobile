/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Router = require('react-router-component');
var Link = Router.Link;

module.exports = React.createClass({

	mixins: [Router.NavigatableMixin],

	isActive: function() {
		return this.getPath().indexOf(this.props.href) === 0;
	},

	render: function() {

		var cssClass = [this.props.className||''];
		if (this.isActive()) {
			cssClass.push('active');
		}

		return (
			<Link {...this.props} className={cssClass.join(' ')}>{this.props.children}</Link>
		);
	}

});
