'use strict';

var React = require('react/addons');

var DragBehavior = require('../behaviors/Draggable');

module.exports = React.createClass({
	displayName: 'Draggable',
	mixins: [DragBehavior],

	propTypes: {
		children: React.PropTypes.element.isRequired
	},


	render: function () {
		var {className} = this.props;

		var classes = ['draggable', className || ''];

		if (this.state.dragging) {
			classes.push('dragging');
		}

		if (this.state.restoring) {
			classes.push('restoring');
		}

		return React.addons.cloneWithProps(
			React.Children.only(this.props.children),

			Object.assign(this.getHandlers(), {
					style: this.computeStyle(),
					className: classes.join(' ')
				}
			)
		);
	}
});
