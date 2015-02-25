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
		basePath: React.PropTypes.string.isRequired
	},

	childContextTypes: {
		basePath: React.PropTypes.string,
		triggerLeftMenu: React.PropTypes.func,
		triggerRightMenu: React.PropTypes.func
	},

	getChildContext () {
		return {
			triggerLeftMenu: ()=>this.refs.frame.onLeftMenuClick(),
			triggerRightMenu: ()=>this.refs.frame.onRightMenuClick(),
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


	onNavigation () {
		this.forceUpdate();
	},


	onStringsChange () {
		this.forceUpdate();
	},


	render () {
	var path = this.props.path || location.href;
		var isLoginView = /\/login/i.test(path);

		var Wrapper = isLoginView ? 'div' : AppContainer;

		if (this.state.mask) {
			return <Loading message={this.state.mask}/>;
		}

		return (
			<CaptureClicks>
				<Wrapper ref="frame">
					<Router path={this.props.path}/>
				</Wrapper>
			</CaptureClicks>
		);
	}
});
