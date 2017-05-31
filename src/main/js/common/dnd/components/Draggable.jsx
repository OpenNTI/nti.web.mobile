import React from 'react';
import createReactClass from 'create-react-class';
import cx from 'classnames';
import {getRefHandler} from 'nti-commons';

import DragBehavior from '../behaviors/Draggable';

export default createReactClass({
	displayName: 'Draggable',
	mixins: [DragBehavior],

	propTypes: {
		children: React.PropTypes.element.isRequired,
		className: React.PropTypes.string
	},


	attachRef (node) {
		this.node = node;
	},


	getDOMNode () {
		return this.node;
	},


	render () {
		const {className, children} = this.props;
		const {dragging, restoring} = this.state;
		const child = React.Children.only(children); //only() will throw if there is not one and only one child.

		const newProps = {
			style: this.computeStyle(),
			//By the time we get to this line, child will be a non-null react element, so dereferencing className from .props is safe.
			// React.cloneElement does not merge classNames together, it replaces.. so we need to get the original className value.
			className: cx('draggable', className, child.props.className, {
				dragging,
				restoring
			}),
			...this.getHandlers(),
			ref: getRefHandler(child.ref, this.attachRef)
		};

		return React.cloneElement(child, newProps);
	}
});
