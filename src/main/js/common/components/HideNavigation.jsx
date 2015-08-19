import React from 'react';
import CSS from 'react/lib/CSSCore';

export default React.createClass({
	displayName: 'HideNavigation',


	componentDidMount () {
		CSS.addClass(document.body.parentNode, 'hide-nav');
	},


	componentWillUnmount () {
		CSS.removeClass(document.body.parentNode, 'hide-nav');
	},

	render () {
		return null;
	}
});
