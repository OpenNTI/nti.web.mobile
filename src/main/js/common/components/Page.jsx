import React from 'react';
import cloneWithProps from 'react/lib/cloneWithProps';

import NavigationBar from 'navigation/components/Bar';

export default React.createClass({
	displayName: 'Page',

	propTypes: {
		pageContent: React.PropTypes.any
	},


	render () {
		let {children} = this.props;

		let props = Object.assign({}, this.props, {
			children: null
		});

		return React.createElement('div', {},
				React.createElement(NavigationBar, props),
				...this.renderChildren(children)
		);
	},


	renderChildren (c) {
		let {pageContent} = this.props;
		let props = Object.assign({}, this.props, {
			availableSections: null,
			children: null,
			title: null
		});

		if (pageContent) {
			return [React.createElement(pageContent, props)];
		}

		if (!c) { return []; }

		if (!Array.isArray(c)) {
			c = [c];
		}

		return c.map(x=>cloneWithProps(x));
	}
});
