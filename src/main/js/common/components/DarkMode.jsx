import React from 'react';
import CSS from 'react/lib/CSSCore';

export default React.createClass({
	displayName: 'DarkMode',


	componentDidMount () {
		CSS.addClass(document.body, 'dark');
	},


	componentWillUnmount () {
		CSS.removeClass(document.body, 'dark');
	},

	render () {
		return null;
	}
});
