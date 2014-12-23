'use strict';

var React = require('react/addons');

var DragBehavior = require('../behaviors/Draggable');

module.exports = React.createClass({
	displayName: 'Draggable',
	mixins: [DragBehavior],

	render: function() {
		return React.createElement('div', this.props);
	}
});
