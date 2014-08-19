/** @jsx React.DOM */

var React = require('react/addons');
var LeftNav = require('./LeftNav');
var Footer = require('./Footer');
var LoginController = require('../../login/LoginController');
var MainContentPanel = require('./MainContentPanel');

var LoginPanel = require('../../login/components/LoginPanel');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;

module.exports = React.createClass({

	getInitialState: function() {
		return {loggedIn: false};
	},

	componentWillMount: function() {
		LoginController.addChangeListener(this.loginStateChangeHandler);
	},

	componentWillUnmount: function() {
		console.log('AppContainer::componentWillUnmount');
		LoginController.removeChangeListener(this.loginStateChangeHandler);
	},

	loginStateChangeHandler: function() {
		console.log('AppContainer.loginStateChangeHandler');
		console.log('Is logged in? %s',LoginController.isLoggedIn());
		if(LoginController.isLoggedIn()) {

		}
		this.setState({loggedIn: LoginController.isLoggedIn()});
	},

	/** this is a test */
	render: function() {
		return (
			React.DOM.div( {className:"app-container"}, 
				React.DOM.div( {className:"off-canvas-wrap", 'data-offcanvas':true}, 
					React.DOM.div( {className:"inner-wrap"}, 
						React.DOM.nav( {className:"tab-bar"}, 
							React.DOM.section( {className:"left-small"}, 
								React.DOM.a( {href:"#", className:"left-off-canvas-toggle menu-icon"}, React.DOM.span(null))
							),
							React.DOM.section( {className:"middle tab-bar-section"}, 
								React.DOM.h1( {className:"title"}, "NextThought")
							),
							React.DOM.section( {className:"right-small"}, 
								React.DOM.a( {className:"right-off-canvas-toggle menu-icon", href:"#"}, React.DOM.span(null))
							)
						),
						React.DOM.aside( {className:"left-off-canvas-menu"}, 
							LeftNav(null )
						),
						React.DOM.aside( {className:"right-off-canvas-menu"}, 
							React.DOM.ul( {className:"off-canvas-list"}, 
								React.DOM.li(null, React.DOM.label(null, "Recent Activity")),
								React.DOM.li(null, React.DOM.a( {href:"#"}, "Event 1")),
								React.DOM.li(null, React.DOM.a( {href:"#"}, "Event 2"))
							)
						),

						React.DOM.section( {className:"main-section"}, 
							MainContentPanel( {key:"mcp", loggedIn:this.state.loggedIn} ),
							Footer(null )
						),

						React.DOM.a( {className:"exit-off-canvas"})
					)
				)				
			)
		);
	}
});
