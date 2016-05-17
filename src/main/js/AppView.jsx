/*globals BUILD_SOURCE*/
import React, {PropTypes} from 'react';
import {environment, CaptureClicks} from 'react-router-component';

import {
	addChangeListener as addLocaleChangeListener,
	removeChangeListener as removeLocaleChangeListener
} from 'nti-lib-locale';
import './locale';

import Router from './Router';
import Loading from 'common/components/Loading';
import Navigatable from 'common/mixins/NavigatableMixin';

import * as NavigationActions from 'navigation/Actions';

import AppContainer from './AppFrame';

const SET_PAGESOURCE = 'navigation:setPageSource';
const SET_CONTEXT = 'navigation:setContext';

export const revision = typeof BUILD_SOURCE === 'undefined' ? 'nah' : BUILD_SOURCE;

export default React.createClass({
	displayName: 'App',
	mixins: [Navigatable],

	propTypes: {
		path: PropTypes.string,
		basePath: PropTypes.string.isRequired
	},

	childContextTypes: {
		basePath: PropTypes.string,
		defaultEnvironment: PropTypes.object,
		[SET_PAGESOURCE]: PropTypes.func,
		[SET_CONTEXT]: PropTypes.func
	},

	getChildContext () {
		return {
			basePath: this.props.basePath,
			defaultEnvironment: environment.defaultEnvironment,
			[SET_PAGESOURCE]: NavigationActions.setPageSource,
			[SET_CONTEXT]: NavigationActions.setContext
		};
	},


	getInitialState () {
		return {};
	},


	componentDidMount () {
		addLocaleChangeListener(this.onStringsChange);
	},


	componentWillUnmount () {
		removeLocaleChangeListener(this.onStringsChange);
	},


	onBeforeNavigation () {
		let {frame} = this;
		if (frame && frame.onCloseMenus) {
			frame.onCloseMenus();
		}
	},


	onStringsChange () {
		this.forceUpdate();
	},


	render () {
		let {mask} = this.state;
		let {path} = this.props;
		let isGated = /\/(login|onboarding)/i.test(path || location.href);

		let Wrapper = isGated ? 'div' : AppContainer;

		if (mask) {
			return <Loading message={typeof mask === 'string' ? mask : void 0}/>;
		}


		return (
			<CaptureClicks>
				<Wrapper ref={x => this.frame = x}>
					<Router path={path} onBeforeNavigation={this.onBeforeNavigation}/>
				</Wrapper>
			</CaptureClicks>
		);
	}
});
