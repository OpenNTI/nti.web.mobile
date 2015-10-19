import React from 'react';


/*
 * Anchor tags cannot be nested within other anchor tags... this works arounds that.
 *
 */
export default React.createClass({
	displayName: 'NestableLink',

	onClick (e) {
		e.preventDefault();
		e.stopPropagation();
		let {link} = this.refs;
		link = React.findDOMNode(link);

		const href = link.getAttribute('href');
		const target = link.getAttribute('target');

		if (target) {
			window.open(href, target);
			return;
		}

		Object.assign(location, {href});
	},


	render () {
		return (
			<span ref="link" {...this.props} onClick={this.onClick}/>
		);
	}
});
