import React from 'react';

import Avatar from 'common/components/Avatar';
import Session from 'common/components/Session';
import Footer from 'common/components/Footer';

import BasePathAware from 'common/mixins/BasePath';
import RouteAware from 'common/mixins/NavigatableMixin';

import MessageDisplay from 'messages/components/Display';
import Navigation from 'navigation/components/View';
import Notifications from 'notifications/components/View';

import {getAppUsername} from 'common/utils';
import {addClass, removeClass} from 'common/utils/dom';
import {getHeight as getViewportHeight} from 'common/utils/viewport';

// import preventOverscroll from 'common/thirdparty/prevent-overscroll';

import Analytics from 'analytics/components/Tag';
import LibraryInvalidationListener from 'library/components/InvalidationListener';

const LEFT_MENU_OPEN = 'move-right';
const RIGHT_MENU_OPEN = 'move-left';
const CLOSE_MENU = '';
const DRAWER_STATE = {
	'#nav': LEFT_MENU_OPEN,
	'#notifications': RIGHT_MENU_OPEN
};


export default React.createClass({
	displayName: 'AppContainer',
	mixins: [BasePathAware, RouteAware],


	onHashChange () {this.forceUpdate();},


	componentDidMount () {
		addEventListener('hashchange', this.onHashChange, false);
	},


	componentDidUnmount () {
		removeEventListener('hashchange', this.onHashChange, false);
	},


	getDrawerState () {
		var key = (global.location || {}).hash || '';
		return DRAWER_STATE[key.toLowerCase()] || '';
	},


	componentDidUpdate () {
		var viewport = document.getElementsByTagName('html')[0];
		var cls = 'scroll-lock';
		var action = (this.getDrawerState() === CLOSE_MENU) ? removeClass : addClass;

		action(viewport, cls);
	},


	render () {

		var state = this.getDrawerState();
		var username = getAppUsername();
		var hamburger = state === LEFT_MENU_OPEN ? 'active' : '';
		var height = {height: getViewportHeight()};

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
							<Navigation/>
						</aside>

						<aside className="right-off-canvas-menu" style={height}>
							<Session username={username}/>
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
		this.gotoFragment(null);
	},


	onLeftMenuClick (e) {
		if (e) {e.preventDefault();}
		this.gotoFragment('nav');
	},


	onRightMenuClick (e) {
		if (e) {e.preventDefault();}
		this.gotoFragment('notifications');
	}
});
