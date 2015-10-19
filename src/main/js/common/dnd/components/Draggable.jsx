import React from 'react';
import cx from 'classnames';

import DragBehavior from '../behaviors/Draggable';

export default React.createClass({
	displayName: 'Draggable',
	mixins: [DragBehavior],

	propTypes: {
		children: React.PropTypes.element.isRequired,
		className: React.PropTypes.string
	},


	render () {
		let {className, children} = this.props;
		let {dragging, restoring} = this.state;
		let child = React.Children.only(children); //only() will throw if there is not one and only one child.

		//By the time we get to this line, child will be a non-null react element, so dereferencing className from .props is safe.
		// React.cloneElement does not merge classNames together, it replaces.. so we need to get the original className value.
		className = cx('draggable', className, child.props.className, {
			dragging,
			restoring
		});

		let newProps = Object.assign({ style: this.computeStyle(), className }, this.getHandlers());

		return React.cloneElement(child, newProps);
	}
});
