import React from 'react';

import Session from 'common/components/Session';
import Footer from 'common/components/Footer';

import RouteAware from 'common/mixins/NavigatableMixin';

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


	getOverlayState () { return (this.state || {}).overlay;	},


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
						<NavigationBar title="next thought" branding/>

						<aside className="left-off-canvas-menu" style={height}>
							<Navigation/>
						</aside>

						<aside className="right-off-canvas-menu" style={height}>
							<Session username={username}/>
							<Notifications/>
						</aside>

						<section className="main-section">
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


	onLeftMenuClick () {
		this.setState({overlay: LEFT_MENU_OPEN});
	},


	onRightMenuClick () {
		this.setState({overlay: RIGHT_MENU_OPEN});
	}
});
