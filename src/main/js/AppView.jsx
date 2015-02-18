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
		addLocaleChangeListener(this._onStringsChange);
	},


	componentWillUnmount () {
		removeLocaleChangeListener(this._onStringsChange);
	},


	_onNavigation () {
		this.forceUpdate();
		scrollTo(0,0);
	},


	_onStringsChange  () {
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
				<Wrapper>
					<Router path={this.props.path} onNavigation={this._onNavigation}/>
				</Wrapper>
			</CaptureClicks>
		);
	}
});
