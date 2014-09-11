/** @jsx React.DOM */

var React = require('react/addons');
var LeftNav = require('./LeftNav');
var Footer = require('./Footer');

var Notifications = require('../../notifications');

var MessageDisplay = require('../messages').Display;

var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;

module.exports = React.createClass({

	propTypes: {
		basePath: React.PropTypes.string.isRequired
	},

	getInitialState: function() {
		return {loggedIn: false};
	},

	componentDidMount: function() {
		$(this.getDOMNode()).foundation();
	},

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
								<h1 className="title">next thought</h1>
							</section>
							<section className="right-small">
								<a className="right-off-canvas-toggle menu-icon" href="#"><span></span></a>
							</section>
						</nav>
						<aside className="left-off-canvas-menu">
							<LeftNav basePath={this.props.basePath}/>
						</aside>
						<aside className="right-off-canvas-menu">
							<Notifications.View/>
						</aside>

						<section className="main-section">
							<MessageDisplay />
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
