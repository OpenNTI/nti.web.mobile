'use strict';

var React = require('react/addons');

var {div} = React.DOM;

var DragBehavior = require('../behaviors/Draggable');

module.exports = React.createClass({
	displayName: 'Draggable',
	mixins: [DragBehavior],

	render: function() {
		return div(this.props);
	}
});
