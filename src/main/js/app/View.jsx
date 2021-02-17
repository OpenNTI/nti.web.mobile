import URL from 'url';

import React from 'react';
import PropTypes from 'prop-types';
import {environment, CaptureClicks, Link} from 'react-router-component';
import {Session} from '@nti/web-session';
import {reportError, getConfig} from '@nti/web-client';
import {Error, Loading, Layouts, Theme} from '@nti/web-commons';
import Logger from '@nti/util-logger';
import {parent} from '@nti/lib-dom';
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
		this.applyTheme();

		this.addGlobalLinkFixer();
	}


	componentWillUnmount () {
		removeLocaleChangeListener(this.onStringsChange);
	}


	componentDidCatch (error, info) {
		this.setState({ error, info, hasError: true });
		reportError(error);
	}


	attachRef = x => this.frame = x

	addGlobalLinkFixer () {
		if (typeof document === 'undefined') { return; }

		const {basePath} = this.props;
		const app = URL.resolve((global.location || {}).href || '', basePath);

		document.addEventListener('click', (e) => {
			const anchor = parent(e.target, 'a');
			const {href} = anchor || {};

			if (!anchor || (href || '').startsWith(app)) { return; }

			anchor.rel = (`${anchor.rel || ''} external`).trim();
		}, true);
	}


	applyTheme () {
		const branding = getConfig('branding');
		const themeProperties = Theme.buildTheme.DefaultProperties;

		themeProperties.assets.fullLogo.href = Theme.buildTheme.makeAssetHREFFallbacks('/site-assets/shared/brand_mobile.png');

		const theme = Theme.buildTheme(themeProperties);

		theme.setOverrides(Theme.siteBrandToTheme(branding));

		this.setState({
			theme
		});
	}


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
		const {state: {hasError, mask, theme}, props: {path}} = this;
		const isGated = /\/(login|onboarding)/i.test(path || global.location.href);

		const Wrapper = isGated ? 'div' : AppContainer;

		if (hasError) {
			return ( <Error {...this.state}/> );
		}

		if (mask) {
			return <Loading.Mask message={typeof mask === 'string' ? mask : void 0}/>;
		}


		return (
			<Theme.Apply theme={theme}>
				<Session>
					<CaptureClicks gotoURL={this.gotoURL}>
						<Wrapper ref={this.attachRef}>
							<Router path={path} onBeforeNavigation={this.onBeforeNavigation}/>
						</Wrapper>
					</CaptureClicks>
				</Session>
			</Theme.Apply>
		);
	}
}
