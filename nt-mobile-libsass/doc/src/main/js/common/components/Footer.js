/** @jsx React.DOM */

var React = require('react/addons');
var LoginController = require('../../login/LoginController');

module.exports = React.createClass({
	render: function() {
		return (
			React.DOM.footer(null, 
				React.DOM.ul(null, 
					React.DOM.li(null)
				)
			)
		);
	}
});

