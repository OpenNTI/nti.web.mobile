import URL from 'url';

import React from 'react';
import PropTypes from 'prop-types';
import {environment, CaptureClicks, Link} from 'react-router-component';
import {Session} from '@nti/web-session';
import {Loading, Layouts} from '@nti/web-commons';
import Logger from '@nti/util-logger';
import {
	addChangeListener as addLocaleChangeListener,
	removeChangeListener as removeLocaleChangeListener
} from '@nti/lib-locale';
import 'locale';

import * as NavigationActions from 'navigation/Actions';

import Router from './Router';
import AppContainer from './AppFrame';

const SET_PAGESOURCE = 'navigation:setPageSource';
const SET_CONTEXT = 'navigation:setContext';

const logger = Logger.get('root:app:View');

Layouts.Responsive.setMobileContext();

export default class App extends React.Component {

	static propTypes = {
		path: PropTypes.string,
		basePath: PropTypes.string.isRequired,
		markNotFound: PropTypes.func
	}

	static childContextTypes = {
		isMobile: PropTypes.bool,
		basePath: PropTypes.string,
		defaultEnvironment: PropTypes.object,
		routerLinkComponent: PropTypes.func,
		setRouteViewTitle: PropTypes.func,
		markNotFound: PropTypes.func,
		[SET_PAGESOURCE]: PropTypes.func,
		[SET_CONTEXT]: PropTypes.func
	}

	getChildContext () {
		return {
			isMobile: true,
			basePath: this.props.basePath,
			routerLinkComponent: Link,
			defaultEnvironment: environment.defaultEnvironment,
			setRouteViewTitle: () => {},
			markNotFound: this.props.markNotFound,
			[SET_PAGESOURCE]: NavigationActions.setPageSource,
			[SET_CONTEXT]: NavigationActions.setContext
		};
	}


	state = {}


	componentDidMount () {
		addLocaleChangeListener(this.onStringsChange);
	}


	componentWillUnmount () {
		removeLocaleChangeListener(this.onStringsChange);
	}


	attachRef = x => this.frame = x


	gotoURL = (url) => {
		const {basePath} = this.props;
		const app = URL.resolve((global.location || {}).href || '', basePath);

		if (!(url || '').startsWith(app)) {
			logger.warn('blocked: Router wants to set location to url: %s', url);
		}
	}


	onBeforeNavigation = () => {
		let {frame} = this;
		if (frame && frame.onCloseMenus) {
			frame.onCloseMenus();
		}
	}


	onStringsChange = () => this.forceUpdate()


	render () {
		const {state: {mask}, props: {path}} = this;
		const isGated = /\/(login|onboarding)/i.test(path || global.location.href);

		const Wrapper = isGated ? 'div' : AppContainer;

		if (mask) {
			return <Loading.Mask message={typeof mask === 'string' ? mask : void 0}/>;
		}


		return (
			<Session>
				<CaptureClicks gotoURL={this.gotoURL}>
					<Wrapper ref={this.attachRef}>
						<Router path={path} onBeforeNavigation={this.onBeforeNavigation}/>
					</Wrapper>
				</CaptureClicks>
			</Session>
		);
	}
}
