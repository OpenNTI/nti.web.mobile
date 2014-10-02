/** @jsx React.DOM */

'use strict';
var Hammer = require('hammerjs');

var React = require('react/addons');
var LeftNav = require('./LeftNav');
var Footer = require('./Footer');

var Notifications = require('notifications');

var MessageDisplay = require('../messages').Display;

var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;

var Library = require('library');

var Navigation = require('navigation');

var t = require('../locale').translate;

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
function _navRec(basePath, opts) {
	return new Navigation.NavRecord({
		label: t(opts.label, {scope: 'NAV.Library'}),
		href: basePath + opts.href,
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

	_libraryChanged: function() {

		var navitems = [];
		var library = Library.Store.getData();
		console.log('[AppContainer]: Library: %O', library);
		var courses = [].concat(library.courses || []);
		var basePath = this.props.basePath;
		navitems.push(_navRec(basePath,{
			label: 'courses',
			href: 'library/courses',
			items: courses
		}));

		var books = [].concat(library.bundles || [], library.packages || []);
		navitems.push(_navRec(basePath,{
			label: 'books',
			href: 'library/books',
			items: books
		}));

		navitems.push(_navRec(basePath,{
			label: 'catalog',
			href: 'catalog/',
			clickable: true
		}));

		var instructing = [].concat(library.coursesAdmin || []);
		if (instructing.length > 0) {
			navitems.push(_navRec(basePath, {
				label: 'instructing',
				href: 'library/admin',
				items: instructing
			}));
		}
		var n = _navRec(basePath, {
			label: 'library',
			children: navitems
		});
		Navigation.Actions.publishNav('root', n);
		// this.setState({leftNav: navitems});

	},


	_navChanged: function(evt) {
		this.setState({leftNav: Navigation.Store.getNav()});
	},


	getInitialState: function() {
		return {
			loggedIn: false,
			leftNav: []
		};
	},


	getDrawerState: function() {
		var key = location.hash || '';
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
		Library.Store.addChangeListener(this._libraryChanged);
		Library.Store.getData(true);
		this.__setupGestures();
	},


	componentWillUnmount: function() {
		Library.Store.removeChangeListener(this._libraryChanged);
		Navigation.Store.removeChangeListener(this._navChanged);
	},


	render: function() {

		var state = this.getDrawerState();

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
								<a	className="right-off-canvas-toggle fi-megaphone"
									onClick={this._onRightMenuClick}
									href="#"><span/></a>
							</section>
						</nav>

						<aside className="left-off-canvas-menu">
							<LeftNav basePath={this.props.basePath}
								items={this.state.leftNav}
								backClick={function() {alert('hi')}}/>
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
