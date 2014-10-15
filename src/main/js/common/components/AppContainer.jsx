/** @jsx React.DOM */
/* global Hammer */
'use strict';

var React = require('react/addons');
var Library = require('library');
var Navigation = require('navigation');
var Notifications = require('notifications');

var Avatar = require('./Avatar');
var LeftNav = require('./LeftNav');
var Footer = require('./Footer');

var MessageDisplay = require('../messages').Display;
var t = require('../locale').translate;
var Utils = require('../Utils');

var preventOverscroll = require('common/thirdparty/prevent-overscroll');


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

/**
 * Convenience function for constructing NavRecords
 * @return {Navigation.NavRecord}
 */
function _navRec(opts) {
	return new Navigation.NavRecord({
		label: t(opts.label, {scope: 'NAV'}),
		href: opts.href,
		clickable: opts.hasOwnProperty('clickable') ? opts.clickable : (opts.items && opts.items.length > 0),
		children: opts.children,
		badge: opts.items ? opts.items.length : null
	});
}



module.exports = React.createClass({
	displayName: 'AppContainer',

	propTypes: {
		basePath: React.PropTypes.string.isRequired
	},

	_navChanged: function(evt) {
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


	__setupGestures: function() {
		var dom = this.getDOMNode();

		var gestures = new Hammer(document.body, {
			swipeVelocityX: 0.05,
			swipeVelocityY: 0.1
		});

		gestures.on('swipe', this._onSwipe);
	},


	componentDidMount: function() {
		Navigation.Store.addChangeListener(this._navChanged);
		Library.Store.getData(true); // Do we still want to do this here?
		this.__setupGestures();
		preventOverscroll(this.getDOMNode().querySelector('.left-off-canvas-menu'));
		preventOverscroll(this.getDOMNode().querySelector('.right-off-canvas-menu'));
	},


	componentWillUnmount: function() {
		Navigation.Store.removeChangeListener(this._navChanged);
	},


	componentDidUpdate: function() {
		var utils = Utils.Dom;
		var viewport = document.getElementsByTagName('html')[0];
		var cls = 'scroll-lock';
		var action = (this.getDrawerState() === CLOSE_MENU) ? 'remove' : 'add';

		utils[action + 'Class'](viewport, cls);
	},


	render: function() {

		var state = this.getDrawerState();
		var username = Utils.getAppUsername();

		return (
			<div className="app-container">
				<div className={'off-canvas-wrap ' + state} data-offcanvas>
					<div className="inner-wrap">
						<nav className="tab-bar">
							<section className="left-small">
								<a	className="left-off-canvas-toggle menu-icon"
									onClick={this._onLeftMenuClick}
									href="#"><span/></a>
							</section>

							<section className="middle tab-bar-section">
								<h1	className="title">next thought</h1>
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
	},


	_onSwipe: function(e) {
		var swippedLeft = e.direction === Hammer.DIRECTION_LEFT;
		var swippedRight = e.direction === Hammer.DIRECTION_RIGHT;

		var state = this.getDrawerState();
		var action = function(){};

		var leftOpen = state === LEFT_MENU_OPEN;
		var rightOpen = state === RIGHT_MENU_OPEN;

		if (swippedRight) {
			action = rightOpen ?
						this._onCloseMenus :
						this._onLeftMenuClick;
		}
		else if (swippedLeft) {
			action = leftOpen ?
						this._onCloseMenus :
						this._onRightMenuClick;
		}

		action();
	}
});
