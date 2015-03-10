import React from 'react';

/**
 * Whats the point of this component? why not just use the element with classname?
 * <figure class="notice">...
 */

export default React.createClass({
	displayName: 'Notice',

	render () {
		let {className} = this.props;
		if (!className) {className=[];}

		className = ['notice'].concat(className).join(' ');
		return (
			<figure {...this.props} className={className}/>
		);
	}
});
