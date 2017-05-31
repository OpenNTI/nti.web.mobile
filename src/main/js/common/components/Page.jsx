import React from 'react';

import NavigationBar from 'navigation/components/Bar';

export default class extends React.Component {
    static displayName = 'Page';

    static propTypes = {
		pageContent: React.PropTypes.any,
		children: React.PropTypes.any
	};

    static childContextTypes = {
		PageWrapped: React.PropTypes.bool
	};

    static contextTypes = {
		PageWrapped: React.PropTypes.bool
	};

    getChildContext() {
		return {PageWrapped: true};
	}

    render() {
		let {children} = this.props;

		let props = Object.assign({}, this.props, {
			children: null
		});

		return React.createElement('div', {},
				this.context.PageWrapped ?
					null :
					React.createElement(NavigationBar, props),
				...this.renderChildren(children)
		);
	}

    renderChildren = (c) => {
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

		return c.map(x=>React.cloneElement(x));
	};
}
