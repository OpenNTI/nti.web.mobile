import React from 'react';

import NavigatableMixin from '../mixins/NavigatableMixin';

export default React.createClass({
	mixins: [NavigatableMixin],

	displayName: 'ActiveState',

	propTypes: {
		activeClassName: React.PropTypes.string,
		className: React.PropTypes.string,
		hasChildren: React.PropTypes.bool,
		href: React.PropTypes.string,
		tag: React.PropTypes.string
	},


	getDefaultProps () {
		return {
			tag: 'span',
			activeClassName: 'active'
		};
	},


	isActive () {
		let current = this.makeHref(this.getPath());
		let {href, hasChildren} = this.props;
		if (hasChildren && current) {
			return current.indexOf(href) === 0;
		}

		//We will make our href's absolute...
		return current === href;
		//this.getPath returns a router-relative ref... our href's are absolute.
		//return this.getPath() === this.props.href;
	},


	render () {
		let {tag, className, activeClassName} = this.props;

		if (activeClassName && this.isActive()) {
			className = className ? `${className} ${activeClassName}` : activeClassName;
		}

		let props = Object.assign({}, this.props, {className});
		let Element = tag;

		if (tag === 'a' || props.link) {
			props.onClick = this.onClick;
		}

		return <Element {...props}/>;
	},


	onClick (e) {
		e.preventDefault();
		e.stopPropagation();
		this.navigate(this.props.href);
	}
});
