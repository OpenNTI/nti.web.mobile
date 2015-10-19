import React from 'react';

import DropBehavior from '../behaviors/Droppable';

export default React.createClass({
	displayName: 'DropTarget',
	mixins: [DropBehavior],

	propTypes: {
		children: React.PropTypes.any
	},

	render () {
		return this.renderDropTargetWrapper(this.props.children);
	}
});
