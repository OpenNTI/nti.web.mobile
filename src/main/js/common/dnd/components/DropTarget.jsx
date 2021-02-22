import createReactClass from 'create-react-class';

import DropBehavior from '../behaviors/Droppable';

export default createReactClass({
	displayName: 'DropTarget',
	mixins: [DropBehavior],

	render() {
		return this.renderDropTargetWrapper();
	},
});
