/** @jsx React.DOM */

var React = require('react/addons');
var LoginActions = require('../../login/LoginActions');
var LoginController = require('../../login/LoginController');
var Button = require('./forms/Button');

module.exports = React.createClass({
	render: function() {

		return (
			React.DOM.ul( {className:"off-canvas-list"}, 
				React.DOM.li(null, React.DOM.label(null, "My Courses ", React.DOM.span( {className:"label radius secondary"}, "4"))),
				React.DOM.li(null, 
			 		React.DOM.select(null, 
						React.DOM.option( {value:"husker"}, "Chemistry of Beer"),
						React.DOM.option( {value:"starbuck"}, "Introduction to Water"),
						React.DOM.option( {value:"hotdog"}, "Intro to Human Physiology"),
						React.DOM.option( {value:"hotdog"}, "Law and Justice")
			        )
				),
				React.DOM.li(null, Button(null, "Browse Courses")),
				React.DOM.li(null, Button( {onClick:LoginActions.logOut, enabled:LoginController.state.isLoggedIn}, "Log Out"))
			)
		);
	}
});
