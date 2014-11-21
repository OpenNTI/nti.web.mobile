/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Navigation = require('navigation');
var Notifications = require('notifications');

var Avatar = require('common/components/Avatar');
var LeftNav = require('common/components/LeftNav');
var Footer = require('common/components/Footer');

var MessageDisplay = require('messages').Display;
var Utils = require('common/Utils');

// var preventOverscroll = require('common/thirdparty/prevent-overscroll');

var Analytics = require('analytics').Component;
var LibraryInvalidationListener = require('library/components/InvalidationListener');

var LEFT_MENU_OPEN = 'move-right';
var RIGHT_MENU_OPEN = 'move-left';
var CLOSE_MENU = '';
var DRAWER_STATE = {
	'#nav': LEFT_MENU_OPEN,
	'#notifications': RIGHT_MENU_OPEN
};


// TODO: move "navigation" specific code into a Navigation
// View (like Notifications.View). This component should just
// be a dumb wrapper that holds everything.


module.exports = React.createClass({
	displayName: 'AppContainer',

	propTypes: {
		basePath: React.PropTypes.string.isRequired
	},

	_navChanged: function() {
		this.setState({
			leftNav: Navigation.Store.getNav(),
			navLoading: Navigation.Store.isLoading()
		});
	},

	getInitialState: function() {
		return {
			loggedIn: false,
			leftNav: []
		};
	},


	getDrawerState: function() {
		var key = (global.location || {}).hash || '';
		return DRAWER_STATE[key.toLowerCase()] || '';
	},


	componentDidMount: function() {
		Navigation.Store.addChangeListener(this._navChanged);
		// preventOverscroll(this.getDOMNode().querySelector('.left-off-canvas-menu'));
		// preventOverscroll(this.getDOMNode().querySelector('.right-off-canvas-menu'));
	},


	componentWillUnmount: function() {
		Navigation.Store.removeChangeListener(this._navChanged);
	},


	componentDidUpdate: function() {
		var utils = Utils.Dom;
		var viewport = document.getElementsByTagName('html')[0];
		var cls = 'scroll-lock';
		var action = (this.getDrawerState() === CLOSE_MENU) ? 'remove' : 'add';

		//Pretend you didn't see the jQuery usage... still very taboo
		//This forces the side drawers to be the hight of the window...
		/* global $ */
		$('[class*=off-canvas-menu]').height(Utils.Viewport.getHeight());

		utils[action + 'Class'](viewport, cls);
	},


	render: function() {

		var state = this.getDrawerState();
		var username = Utils.getAppUsername();

		return (
			<div className="app-container">
				<Analytics />
				<LibraryInvalidationListener />
				<div className={'off-canvas-wrap ' + state} data-offcanvas>
					<div className="inner-wrap">
						<nav className="tab-bar">
							<section className="left-small">
								<a	className="left-off-canvas-toggle menu-icon"
									onClick={this._onLeftMenuClick}
									href="#"><span/></a>
							</section>

							<section className="middle tab-bar-section">
								<a href={this.props.basePath}>
									<h1 className="title">next thought</h1></a>
							</section>

							<section className="right-small">
								<a	className="right-off-canvas-toggle"
									onClick={this._onRightMenuClick}
									href="#"><Avatar username={username} /></a>
							</section>
						</nav>

						<aside className="left-off-canvas-menu">
							<LeftNav basePath={this.props.basePath}
								isLoading={this.state.navLoading}
								items={this.state.leftNav} />
						</aside>

						<aside className="right-off-canvas-menu">
							<Notifications.View/>
						</aside>

						<section className="main-section">
							<MessageDisplay />
							{this.props.children}
							<Footer />
						</section>

						<a className="exit-off-canvas" onClick={this._onCloseMenus}></a>
					</div>
				</div>
			</div>
		);
	},


	_onCloseMenus: function(e) {
		if (e) {e.preventDefault();}
		Navigation.Actions.gotoFragment(null);
	},


	_onLeftMenuClick: function(e) {
		if (e) {e.preventDefault();}
		Navigation.Actions.gotoFragment('nav');
	},


	_onRightMenuClick: function(e) {
		if (e) {e.preventDefault();}
		Navigation.Actions.gotoFragment('notifications');
	}
});
