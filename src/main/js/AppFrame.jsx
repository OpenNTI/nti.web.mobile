import React from 'react';

import Avatar from 'common/components/Avatar';
import Session from 'common/components/Session';
import Footer from 'common/components/Footer';

import RouteAware from 'common/mixins/NavigatableMixin';

import MessageDisplay from 'messages/components/Display';
import NavigationBar from 'navigation/components/Bar';
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

export default React.createClass({
	displayName: 'AppContainer',
	mixins: [RouteAware],


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
		var action = (this.getOverlayState() == null) ? removeClass : addClass;

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

						<NavigationBar title="NextThought">

							<a className="left-off-canvas-toggle hamburger"
									onClick={this.onLeftMenuClick}
									href="#"><span/></a>

							<a	className="right-off-canvas-toggle"
									onClick={this.onRightMenuClick}
									href="#"><Avatar username={username} /></a>

						</NavigationBar>


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
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		this.setState({overlay: null});
	},


	onLeftMenuClick (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		this.setState({overlay: LEFT_MENU_OPEN});
	},


	onRightMenuClick (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		this.setState({overlay: RIGHT_MENU_OPEN});
	}
});
