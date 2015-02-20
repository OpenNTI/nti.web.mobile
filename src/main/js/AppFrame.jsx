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

const LEFT_MENU_OPEN = 'offcanvas-overlap-right';
const RIGHT_MENU_OPEN = 'offcanvas-overlap-left';
const CLOSE_MENU = '';

export default React.createClass({
	displayName: 'AppContainer',
	mixins: [BasePathAware, RouteAware],


	onNavChange () {this.onCloseMenus();},


	componentDidMount () {
		addEventListener('hashchange', this.onNavChange, false);
		addEventListener('popstate', this.onNavChange, false);
	},


	componentDidUnmount () {
		removeEventListener('hashchange', this.onNavChange, false);
		removeEventListener('popstate', this.onNavChange, false);
	},


	getOverlayState () {
		return (this.state || {}).overlay;
	},


	componentDidUpdate () {
		var viewport = document.getElementsByTagName('html')[0];
		var action = (this.getOverlayState() === CLOSE_MENU) ? removeClass : addClass;

		action(viewport, 'scroll-lock');
	},


	render () {
		var height = {height: getViewportHeight()};
		var state = this.getOverlayState();
		var username = getAppUsername();

		return (
			<div className="app-container">
				<Analytics />
				<LibraryInvalidationListener />
				<div className={`off-canvas-wrap ${state}`} data-offcanvas>
					<div className="inner-wrap">
						<nav className="tab-bar">
							<section className="left-small">
								<a className="left-off-canvas-toggle hamburger"
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
		this.setState({overlay: null});
	},


	onLeftMenuClick (e) {
		if (e) {e.preventDefault();}
		this.setState({overlay: LEFT_MENU_OPEN});
	},


	onRightMenuClick (e) {
		if (e) {e.preventDefault();}
		this.setState({overlay: RIGHT_MENU_OPEN});
	}
});
