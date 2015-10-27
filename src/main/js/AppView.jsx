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

//webpack magic
import '../resources/scss/app.scss';

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
		let {mask} = this.state;
		let {path} = this.props;
		let isGated = /\/(login|tos)/i.test(path || location.href);

		let Wrapper = isGated ? 'div' : AppContainer;

		if (mask) {
			return <Loading message={typeof mask === 'string' ? mask : void 0}/>;
		}


		return (
			<CaptureClicks>
				<Wrapper ref="frame">
					<Router path={path} onBeforeNavigation={this.onBeforeNavigation}/>
				</Wrapper>
			</CaptureClicks>
		);
	}
});
