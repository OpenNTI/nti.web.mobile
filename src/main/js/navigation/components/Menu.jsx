import React from 'react';

import {addClass, removeClass} from 'nti-lib-dom';
const getViewport = ()=> document.getElementsByTagName('html')[0];

export default React.createClass({
	displayName: 'Menu',

	componentDidMount () {
		addClass(getViewport(), 'scroll-lock');
	},

	componentWillUnmount () {
		removeClass(getViewport(), 'scroll-lock');
	},

	render () {
		return (<ul {...this.props}/>);
	}
});
