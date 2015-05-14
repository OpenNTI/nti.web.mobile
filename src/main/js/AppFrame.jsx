import React from 'react';
import cloneWithProps from 'react/lib/cloneWithProps';

import Session from 'common/components/Session';
import Footer from 'common/components/Footer';

import RouteAware from 'common/mixins/NavigatableMixin';

import Notifications from 'notifications/components/View';

import addClass from 'nti.lib.dom/lib/addclass';
import removeClass from 'nti.lib.dom/lib/removeclass';
import {getAppUsername} from 'common/utils';
import {getHeight as getViewportHeight} from 'common/utils/viewport';

// import preventOverscroll from 'common/thirdparty/prevent-overscroll';

import Analytics from 'analytics/components/Tag';
import LibraryInvalidationListener from 'library/components/InvalidationListener';

const LEFT_MENU_OPEN = 'offcanvas-overlap-right';
const RIGHT_MENU_OPEN = 'offcanvas-overlap-left';

export default React.createClass({
	displayName: 'AppContainer',
	mixins: [RouteAware],

	propTypes: {
		children: React.PropTypes.element
	},


	childContextTypes: {
		triggerLeftMenu: React.PropTypes.func,
		triggerRightMenu: React.PropTypes.func
	},

	getChildContext () {
		return {
			triggerLeftMenu: this.onLeftMenuClick,
			triggerRightMenu: this.onRightMenuClick
		};
	},


	onNavChange () { this.onCloseMenus(); },


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
		let viewport = document.getElementsByTagName('html')[0];
		let action = (this.getOverlayState() == null) ? removeClass : addClass;

		action(viewport, 'scroll-lock');
	},


	render () {
		let height = {height: getViewportHeight()};
		let state = this.getOverlayState();
		let username = getAppUsername();

		return (
			<div className="app-container">
				<Analytics />
				<LibraryInvalidationListener />

				<div className={`off-canvas-wrap ${state}`} data-offcanvas>
					<div className="inner-wrap">

						<aside className="right-off-canvas-menu" style={height}>
							<Session username={username}/>
							<Notifications/>
						</aside>

						<section className="main-section">
							{this.renderView()}
							<Footer />
						</section>
						<a className="exit-off-canvas" onClick={this.onCloseMenus}></a>
					</div>
				</div>
			</div>
		);
	},


	renderView () {
		let {children} = this.props;
		return cloneWithProps(React.Children.only(children));
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
