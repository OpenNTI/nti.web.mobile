import React from 'react';
import CaptureClicks from 'react-router-component/lib/CaptureClicks';

import {
	addChangeListener as addLocaleChangeListener,
	removeChangeListener as removeLocaleChangeListener
} from 'common/locale';

import Router from './Router';
import Loading from 'common/components/Loading';
import Navigatable from 'common/mixins/NavigatableMixin';

import AppContainer from './AppFrame';

export default React.createClass({
	displayName: 'App',
	mixins: [Navigatable],

	propTypes: {
		path: React.PropTypes.string,
		basePath: React.PropTypes.string.isRequired
	},

	childContextTypes: {
		basePath: React.PropTypes.string
	},

	getChildContext () {
		return {
			basePath: this.props.basePath
		};
	},


	getInitialState () {
		return {};
	},


	componentWillMount () {
		require('../resources/scss/app.scss');
	},


	componentDidMount () {
		addLocaleChangeListener(this.onStringsChange);
	},


	componentWillUnmount () {
		removeLocaleChangeListener(this.onStringsChange);
	},


	onBeforeNavigation () {
		let {frame} = this.refs;
		if (frame && frame.onCloseMenus) {
			frame.onCloseMenus();
		}
	},


	onStringsChange () {
		this.forceUpdate();
	},


	render () {
		let path = this.props.path || location.href;
		let isLoginView = /\/login/i.test(path);

		let Wrapper = isLoginView ? 'div' : AppContainer;

		if (this.state.mask) {
			return <Loading message={this.state.mask}/>;
		}

		return (
			<CaptureClicks>
				<Wrapper ref="frame">
					<Router path={this.props.path} onBeforeNavigation={this.onBeforeNavigation}/>
				</Wrapper>
			</CaptureClicks>
		);
	}
});
