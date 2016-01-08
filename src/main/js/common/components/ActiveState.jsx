import React from 'react';
import cx from 'classnames';


import {child as ActiveStateBehavior} from '../mixins/ActiveStateSelector';

export default React.createClass({
	displayName: 'ActiveState',
	mixins: [ActiveStateBehavior],

	propTypes: {
		activeClassName: React.PropTypes.string,
		className: React.PropTypes.string,
		hasChildren: React.PropTypes.oneOfType([
			React.PropTypes.bool,
			React.PropTypes.shape({
				test: React.PropTypes.func.isRequired
			})
		]),
		href: React.PropTypes.string,
		link: React.PropTypes.bool, //force onClick handler for non-'a' tags
		tag: React.PropTypes.any
	},


	getDefaultProps () {
		return {
			tag: 'span',
			activeClassName: 'active'
		};
	},


	render () {
		const {props: {tag: Element, className, activeClassName, link}} = this;
		const props = Object.assign({},
			this.props, {
				tag: void 0,
				className: cx(className, {
					[activeClassName]: this.isActive()
				})
			});

		if (Element === 'a' || link) {
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
