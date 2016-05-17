/*globals BUILD_SOURCE*/
import React from 'react';
import {environment, CaptureClicks} from 'react-router-component';

import {
	addChangeListener as addLocaleChangeListener,
	removeChangeListener as removeLocaleChangeListener
} from 'nti-lib-locale';
import './locale';

import Router from './Router';
import Loading from 'common/components/Loading';
import Navigatable from 'common/mixins/NavigatableMixin';

import AppContainer from './AppFrame';

export const revision = typeof BUILD_SOURCE === 'undefined' ? 'nah' : BUILD_SOURCE;

export default React.createClass({
	displayName: 'App',
	mixins: [Navigatable],

	propTypes: {
		path: React.PropTypes.string,
		basePath: React.PropTypes.string.isRequired
	},

	childContextTypes: {
		basePath: React.PropTypes.string,
		defaultEnvironment: React.PropTypes.object
	},

	getChildContext () {
		return {
			basePath: this.props.basePath,
			defaultEnvironment: environment.defaultEnvironment
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
