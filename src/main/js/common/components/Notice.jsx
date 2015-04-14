import React from 'react';

/**
 * Whats the point of this component? why not just use the element with classname?
 * <figure class="notice">...
 */

export default React.createClass({
	displayName: 'Notice',

	propTypes: {
		className: React.PropTypes.string
	},


	getDefaultProps () {
		return {
			className: React.PropTypes.string
		};
	},

	render () {
		let {className = []} = this.props;

		className = ['notice'].concat(className).join(' ');
		return (
			<figure {...this.props} className={className}/>
		);
	}
});
