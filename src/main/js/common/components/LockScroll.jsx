import React from 'react';
import CSS from 'fbjs/lib/CSSCore';

export default React.createClass({
	displayName: 'LockScroll',


	componentDidMount () {
		CSS.addClass(document.body.parentNode, 'scroll-lock');
	},


	componentWillUnmount () {
		CSS.removeClass(document.body.parentNode, 'scroll-lock');
	},

	render () {
		return null;
	}
});
