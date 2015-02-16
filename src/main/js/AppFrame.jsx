'use strict';

var React = require('react');
var NavigationActions = require('navigation/Actions');
var NavigationStore = require('navigation/Store');
var Notifications = require('notifications/components/View');

var Avatar = require('common/components/Avatar');
var LeftNav = require('common/components/LeftNav');
var Footer = require('common/components/Footer');

var BasePathAware = require('common/mixins/BasePath');

var MessageDisplay = require('messages/components/Display');
var Utils = require('common/Utils');

// var preventOverscroll = require('common/thirdparty/prevent-overscroll');

var Analytics = require('analytics/components/Tag');
var LibraryInvalidationListener = require('library/components/InvalidationListener');

var LEFT_MENU_OPEN = 'move-right';
var RIGHT_MENU_OPEN = 'move-left';
var CLOSE_MENU = '';
var DRAWER_STATE = {
	'#nav': LEFT_MENU_OPEN,
	'#notifications': RIGHT_MENU_OPEN
};


module.exports = React.createClass({
	displayName: 'AppContainer',
	mixins: [BasePathAware],


	_navChanged: function() {
		this.setState({
			leftNav: NavigationStore.getNav(),
			navLoading: NavigationStore.isLoading()
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
		NavigationStore.addChangeListener(this._navChanged);
		// preventOverscroll(this.getDOMNode().querySelector('.left-off-canvas-menu'));
		// preventOverscroll(this.getDOMNode().querySelector('.right-off-canvas-menu'));
	},


	componentWillUnmount: function() {
		NavigationStore.removeChangeListener(this._navChanged);
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
		var hamburger = state === LEFT_MENU_OPEN ? 'active' : '';
		var height = {height: Utils.Viewport.getHeight()};

		return (
			<div className="app-container">
				<Analytics />
				<LibraryInvalidationListener />
				<div className={'off-canvas-wrap ' + state} data-offcanvas>
					<div className="inner-wrap">
						<nav className="tab-bar">
							<section className="left-small">
								<a	className={`left-off-canvas-toggle hamburger ${hamburger}`}
									onClick={this._onLeftMenuClick}
									href="#"><span/></a>
							</section>

							<section className="middle tab-bar-section">
								<a href={this.getBasePath()}>
									<h1 className="title">next thought</h1></a>
							</section>

							<section className="right-small">
								<a	className="right-off-canvas-toggle"
									onClick={this._onRightMenuClick}
									href="#"><Avatar username={username} /></a>
							</section>
						</nav>

						<aside className="left-off-canvas-menu" style={height}>
							<LeftNav
								isLoading={this.state.navLoading}
								items={this.state.leftNav} />
						</aside>

						<aside className="right-off-canvas-menu" style={height}>
							<Notifications/>
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
		NavigationActions.gotoFragment(null);
	},


	_onLeftMenuClick: function(e) {
		if (e) {e.preventDefault();}
		NavigationActions.gotoFragment('nav');
	},


	_onRightMenuClick: function(e) {
		if (e) {e.preventDefault();}
		NavigationActions.gotoFragment('notifications');
	}
});
