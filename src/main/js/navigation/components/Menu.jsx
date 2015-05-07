import React from 'react';
import CSSCore from 'react/lib/CSSCore';

const getViewport = ()=> document.getElementsByTagName('html')[0];

export default React.createClass({
	displayName: 'Menu',

	componentDidMount () {
		CSSCore.addClass(getViewport(), 'scroll-lock');
	},

	componentWillUnmount () {
		CSSCore.removeClass(getViewport(), 'scroll-lock');
	},

	render () {
		return (<ul {...this.props}/>);
	}
});
