/** @jsx React.DOM */

var React = require('react/addons');
var LeftNav = require('./LeftNav');
var Footer = require('./Footer');
var MainContentPanel = require('./MainContentPanel');


var Messages = require('../messages');
var MessageDisplay = Messages.Display;
var MessageStore = Messages.Store;
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;

module.exports = React.createClass({

	getInitialState: function() {
		return {loggedIn: false};
	},

	// componentWillMount: function() {
	// 	LoginController.addChangeListener(this.loginStateChangeHandler);
	// },

	// componentWillUnmount: function() {
	// 	console.log('AppContainer::componentWillUnmount');
	// 	LoginController.removeChangeListener(this.loginStateChangeHandler);
	// },

	// loginStateChangeHandler: function() {
	// 	console.log('AppContainer.loginStateChangeHandler');
	// 	console.log('Is logged in? %s',LoginController.isLoggedIn());
	// 	if(LoginController.isLoggedIn()) {

	// 	}
	// 	this.setState({loggedIn: LoginController.isLoggedIn()});
	// },

	render: function() {
		return (
			<div className="app-container">
				<div className="off-canvas-wrap" data-offcanvas>
					<div className="inner-wrap">
						<nav className="tab-bar">
							<section className="left-small">
								<a href="#" className="left-off-canvas-toggle menu-icon"><span></span></a>
							</section>
							<section className="middle tab-bar-section">
								<h1 className="title">NextThought</h1>
							</section>
							<section className="right-small">
								<a className="right-off-canvas-toggle menu-icon" href="#"><span></span></a>
							</section>
						</nav>
						<aside className="left-off-canvas-menu">
							<LeftNav />
						</aside>
						<aside className="right-off-canvas-menu">
							<ul className="off-canvas-list">
								<li><label>Recent Activity</label></li>
								<li><a href="#">Event 1</a></li>
								<li><a href="#">Event 2</a></li>
							</ul>
						</aside>

						<section className="main-section">
							<MessageDisplay messages={MessageStore._messages} />
							{this.props.children}
							<Footer />
						</section>

						<a className="exit-off-canvas"></a>
					</div>
				</div>
			</div>
		);
	}
});
