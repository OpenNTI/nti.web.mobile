/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var LoginController = require('../LoginController');
var LoginActions = require('../LoginActions');
var LoginConstants = require('../LoginConstants');

module.exports = React.createClass({
	render: function() {
		var links = [];
		for(var item in LoginController.state.links) {
			links.push(<li key={item}>{item}:  <div>{LoginController.getHref(item)}</div></li>);
		}
		return (
			<div style={{color:'lightgray'}}>
				<h3>(debug info)</h3>
				<div>enabled ? {this.props.submitEnabled ? 'true' : 'false'}</div>
				LOGIN_PASSWORD_LINK: '{LoginController.getHref(LoginConstants.LOGIN_PASSWORD_LINK)}'
				<ul>
					{links}
				</ul>
			</div>
		);
	}
});
