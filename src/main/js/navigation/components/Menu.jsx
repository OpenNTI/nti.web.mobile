import React from 'react';
import CSS from 'react/lib/CSSCore';

const getViewport = ()=> document.getElementsByTagName('html')[0];

export default React.createClass({
	displayName: 'Menu',

	componentDidMount () {
		CSS.addClass(getViewport(), 'scroll-lock');
	},

	componentWillUnmount () {
		CSS.removeClass(getViewport(), 'scroll-lock');
	},

	render () {
		return (<ul {...this.props}/>);
	}
});
