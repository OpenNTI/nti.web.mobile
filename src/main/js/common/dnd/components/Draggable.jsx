import React from 'react';
import cloneWithProps from 'react/lib/cloneWithProps';

import DragBehavior from '../behaviors/Draggable';

export default React.createClass({
	displayName: 'Draggable',
	mixins: [DragBehavior],

	propTypes: {
		children: React.PropTypes.element.isRequired
	},


	render () {
		var {className} = this.props;

		var classes = ['draggable', className || ''];

		if (this.state.dragging) {
			classes.push('dragging');
		}

		if (this.state.restoring) {
			classes.push('restoring');
		}

		return cloneWithProps(
			React.Children.only(this.props.children),

			Object.assign(this.getHandlers(), {
					style: this.computeStyle(),
					className: classes.join(' ')
				}
			)
		);
	}
});
