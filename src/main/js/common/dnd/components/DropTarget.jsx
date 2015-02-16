'use strict';

var React = require('react');

var DropBehavior = require('../behaviors/Droppable');

module.exports = React.createClass({
	displayName: 'DropTarget',
	mixins: [DropBehavior],

	render: function() {
		return this.renderDropTargetWrapper(this.props.children);
	}
});
