import React from 'react';

import DropBehavior from '../behaviors/Droppable';

export default React.createClass({
	displayName: 'DropTarget',
	mixins: [DropBehavior],

	render () {
		return this.renderDropTargetWrapper(this.props.children);
	}
});
