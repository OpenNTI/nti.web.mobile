import React from 'react';

import ObjectLink from '../mixins/ObjectLink';

export default React.createClass({
	displayName: 'GotoItem',
	mixins: [ObjectLink],

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		const {item} = this.props;
		return (
			<a href={this.objectLink(item)} {...this.props} />
		);
	}
});
