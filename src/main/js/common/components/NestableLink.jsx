import React from 'react';
import ReactDOM from 'react-dom';


/*
 * Anchor tags cannot be nested within other anchor tags... this works arounds that.
 *
 */
export default React.createClass({
	displayName: 'NestableLink',

	onClick (e) {
		e.preventDefault();
		e.stopPropagation();
		const link = ReactDOM.findDOMNode(this.link);
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
			<span ref={x => this.link = x} {...this.props} onClick={this.onClick}/>
		);
	}
});
