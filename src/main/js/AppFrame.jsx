import React from 'react';
import NavigationActions from 'navigation/Actions';
import NavigationStore from 'navigation/Store';
import Notifications from 'notifications/components/View';

import Avatar from 'common/components/Avatar';
import LeftNav from 'common/components/LeftNav';
import Footer from 'common/components/Footer';

import BasePathAware from 'common/mixins/BasePath';

import MessageDisplay from 'messages/components/Display';
import Utils from 'common/Utils';

// import preventOverscroll from 'common/thirdparty/prevent-overscroll';

import Analytics from 'analytics/components/Tag';
import LibraryInvalidationListener from 'library/components/InvalidationListener';

import LogoutButton from 'login/components/LogoutButton';

const LEFT_MENU_OPEN = 'move-right';
const RIGHT_MENU_OPEN = 'move-left';
const CLOSE_MENU = '';
const DRAWER_STATE = {
	'#nav': LEFT_MENU_OPEN,
	'#notifications': RIGHT_MENU_OPEN
};


export default React.createClass({
	displayName: 'AppContainer',
	mixins: [BasePathAware],


	_navChanged () {
		this.setState({
			leftNav: NavigationStore.getNav(),
			navLoading: NavigationStore.isLoading()
		});
	},


	getInitialState () {
		return {
			loggedIn: false,
			leftNav: []
		};
	},


	getDrawerState () {
		var key = (global.location || {}).hash || '';
		return DRAWER_STATE[key.toLowerCase()] || '';
	},


	componentDidMount () {
		NavigationStore.addChangeListener(this._navChanged);
		// preventOverscroll(this.getDOMNode().querySelector('.left-off-canvas-menu'));
		// preventOverscroll(this.getDOMNode().querySelector('.right-off-canvas-menu'));
	},


	componentWillUnmount () {
		NavigationStore.removeChangeListener(this._navChanged);
	},


	componentDidUpdate () {
		var utils = Utils.Dom;
		var viewport = document.getElementsByTagName('html')[0];
		var cls = 'scroll-lock';
		var action = (this.getDrawerState() === CLOSE_MENU) ? 'remove' : 'add';

		utils[action + 'Class'](viewport, cls);
	},


	render () {

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
									onClick={this.onLeftMenuClick}
									href="#"><span/></a>
							</section>

							<section className="middle tab-bar-section">
								<a href={this.getBasePath()}>
									<h1 className="title">next thought</h1></a>
							</section>

							<section className="right-small">
								<a	className="right-off-canvas-toggle"
									onClick={this.onRightMenuClick}
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

						<a className="exit-off-canvas" onClick={this.onCloseMenus}></a>
					</div>
				</div>
			</div>
		);
	},


	onCloseMenus (e) {
		if (e) {e.preventDefault();}
		NavigationActions.gotoFragment(null);
	},


	onLeftMenuClick (e) {
		if (e) {e.preventDefault();}
		NavigationActions.gotoFragment('nav');
	},


	onRightMenuClick (e) {
		if (e) {e.preventDefault();}
		NavigationActions.gotoFragment('notifications');
	}
});
