import React from 'react';
import CSS from 'fbjs/lib/CSSCore';

import Session from 'common/components/Session';
import {Footer, LockScroll} from 'nti-web-commons';

import Notifications from 'notifications/components/View';

import {getViewportHeight} from 'nti-lib-dom';

import Analytics from 'analytics/components/Tag';
import LibraryInvalidationListener from 'library/components/InvalidationListener';

const LEFT_MENU_OPEN = 'offcanvas-overlap-right';
const RIGHT_MENU_OPEN = 'offcanvas-overlap-left';

export default React.createClass({
	displayName: 'AppContainer',

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


	attachRightMenuRef (ref) {
		this.rightMenu = ref;
	},


	onNavChange () { this.onCloseMenus(); },


	componentDidMount () {
		addEventListener('hashchange', this.onNavChange, false);
		addEventListener('popstate', this.onNavChange, false);
	},


	componentWillUnmount () {
		removeEventListener('hashchange', this.onNavChange, false);
		removeEventListener('popstate', this.onNavChange, false);
	},


	getOverlayState () { return (this.state || {}).overlay; },


	render () {
		const height = {height: getViewportHeight()};
		const state = this.getOverlayState() || '';
		const {children} = this.props;

		return (
			<div className="app-container">
				<Analytics />
				<LibraryInvalidationListener />
				{this.getOverlayState() != null && (<LockScroll/> )}

				<div className={`off-canvas-wrap ${state}`} data-offcanvas>
					<div className="inner-wrap">


							<aside className="right-off-canvas-menu" style={height} ref={this.attachRightMenuRef}>
								{this.getOverlayState() != null && ( <Session /> )}
								{this.getOverlayState() != null && ( <Notifications/> )}
							</aside>


						<section className="main-section">
							{children}
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
		this.setState({overlay: null}, () => {

			//if there is a timer going already, kill it.
			clearTimeout(this.waitForCloseAnimation);
			//We don't want to just kick the drawer off screen... wait for its animation to finish. (if it will)
			this.waitForCloseAnimation = setTimeout(() => {
				//get a reference to the dom node.
				const {rightMenu: el} = this;
				if (el) {
					CSS.addClass(el, 'kill-transitions');
					setTimeout(()=> CSS.removeClass(el, 'kill-transitions'), 17/*one frame*/);
				}
			}, 550);


		});
	},


	onLeftMenuClick () {
		this.setState({overlay: LEFT_MENU_OPEN});
	},


	onRightMenuClick () {
		this.setState({overlay: RIGHT_MENU_OPEN});
	}
});
