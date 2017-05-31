import PropTypes from 'prop-types';
import React from 'react';
import {addClass, removeClass} from 'nti-lib-dom';

import Session from './Session';
import {Footer, LockScroll, ConflictResolutionHandler} from 'nti-web-commons';

import Notifications from 'notifications/components/View';

import {getViewportHeight} from 'nti-lib-dom';

import LibraryInvalidationListener from 'library/components/InvalidationListener';

const LEFT_MENU_OPEN = 'offcanvas-overlap-right';
const RIGHT_MENU_OPEN = 'offcanvas-overlap-left';

export default class extends React.Component {
    static displayName = 'AppContainer';

    static propTypes = {
		children: PropTypes.element
	};

    static childContextTypes = {
		triggerLeftMenu: PropTypes.func,
		triggerRightMenu: PropTypes.func
	};

    getChildContext() {
		return {
			triggerLeftMenu: this.onLeftMenuClick,
			triggerRightMenu: this.onRightMenuClick
		};
	}

    attachRightMenuRef = (ref) => {
		this.rightMenu = ref;
	};

    onNavChange = () => { this.onCloseMenus(); };

    componentDidMount() {
		addEventListener('hashchange', this.onNavChange, false);
		addEventListener('popstate', this.onNavChange, false);
	}

    componentWillUnmount() {
		removeEventListener('hashchange', this.onNavChange, false);
		removeEventListener('popstate', this.onNavChange, false);
	}

    getOverlayState = () => { return (this.state || {}).overlay; };

    render() {
		const height = {height: getViewportHeight()};
		const state = this.getOverlayState() || '';
		const {children} = this.props;

		return (
			<div className="app-container">
				<ConflictResolutionHandler/>
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
						<a className="exit-off-canvas" onClick={this.onCloseMenus}/>
					</div>
				</div>
			</div>
		);
	}

    onCloseMenus = (e) => {
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
					addClass(el, 'kill-transitions');
					setTimeout(()=> removeClass(el, 'kill-transitions'), 17/*one frame*/);
				}
			}, 550);


		});
	};

    onLeftMenuClick = () => {
		this.setState({overlay: LEFT_MENU_OPEN});
	};

    onRightMenuClick = () => {
		this.setState({overlay: RIGHT_MENU_OPEN});
	};
}
