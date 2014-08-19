/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var LoginController = require('../LoginController');
var LoginActions = require('../LoginActions');
var LoginConstants = require('../LoginConstants');

/**
* Utility React component for emitting debug info for LoginPanel.
* @class DebugInfo
*/
module.exports = React.createClass({
	render: function() {
		var links = [];
		for(var item in LoginController.state.links) {
			links.push(React.DOM.li( {key:item}, item,": ",  React.DOM.div(null, LoginController.getHref(item))));
		}
		return (
			React.DOM.div( {style:{color:'lightgray'}}, 
				React.DOM.h3(null, "(debug info)"),
				React.DOM.div(null, "enabled ? ", this.props.submitEnabled ? 'true' : 'false'),
				" LOGIN_PASSWORD_LINK: '",LoginController.getHref(LoginConstants.LOGIN_PASSWORD_LINK),"' ",
				React.DOM.ul(null, 
					links
				)
			)
		);
	}
});
