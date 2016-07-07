/*globals BUILD_SOURCE*/
import React, {PropTypes} from 'react';
import {environment, CaptureClicks, Link} from 'react-router-component';
import URL from 'url';

import Logger from 'nti-util-logger';
import {
	addChangeListener as addLocaleChangeListener,
	removeChangeListener as removeLocaleChangeListener
} from 'nti-lib-locale';
import 'locale';

import Router from './Router';
import {Loading} from 'nti-web-commons';


import * as NavigationActions from 'navigation/Actions';

import AppContainer from './AppFrame';

const SET_PAGESOURCE = 'navigation:setPageSource';
const SET_CONTEXT = 'navigation:setContext';

export const revision = typeof BUILD_SOURCE === 'undefined' ? 'nah' : BUILD_SOURCE;

const logger = Logger.get('root:app:View');

export default class App extends React.Component {

	static propTypes = {
		path: PropTypes.string,
		basePath: PropTypes.string.isRequired
	}

	static childContextTypes = {
		basePath: PropTypes.string,
		defaultEnvironment: PropTypes.object,
		routerLinkComponent: PropTypes.func,
		[SET_PAGESOURCE]: PropTypes.func,
		[SET_CONTEXT]: PropTypes.func
	}

	getChildContext () {
		return {
			basePath: this.props.basePath,
			routerLinkComponent: Link,
			defaultEnvironment: environment.defaultEnvironment,
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
		const isGated = /\/(login|onboarding)/i.test(path || location.href);

		const Wrapper = isGated ? 'div' : AppContainer;

		if (mask) {
			return <Loading message={typeof mask === 'string' ? mask : void 0}/>;
		}


		return (
			<CaptureClicks gotoURL={this.gotoURL}>
				<Wrapper ref={this.attachRef}>
					<Router path={path} onBeforeNavigation={this.onBeforeNavigation}/>
				</Wrapper>
			</CaptureClicks>
		);
	}
}
