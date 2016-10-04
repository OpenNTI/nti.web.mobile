import React from 'react';
import cx from 'classnames';

import {Array as ArrayUtils} from 'nti-commons';

import {isPointWithin} from 'nti-lib-dom';
import Base, {TYPE_SHAPE} from './Base';

const getWrapperElementClassName = 'droppable:getWrapperElementClassName';
const onDragDrop = 'droppable:onDragDrop';
const onDragEnteredDropTarget = 'droppable:onDragEnteredDropTarget';
const onDragLeftDropTarget = 'droppable:onDragLeftDropTarget';
const onDraggableNotification = 'droppable:onDraggableNotification';

export default {
	mixins: [Base],

	propTypes: {
		accepts: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.shape(TYPE_SHAPE),
			React.PropTypes.arrayOf(React.PropTypes.string),
			React.PropTypes.arrayOf(React.PropTypes.shape(TYPE_SHAPE))
		]).isRequired
	},


	contextTypes: {
		dndEvents: React.PropTypes.object,
		currentDragItem: React.PropTypes.object,
		onDragOver: React.PropTypes.func.isRequired,
		onDrop: React.PropTypes.func.isRequired
	},


	isActive () {
		let drag = this.context.currentDragItem;
		let type = drag && drag.props.type;
		return drag && this.accepts(type);
	},


	isDisabled () {
		let drag = this.context.currentDragItem;
		let type = drag && drag.props.type;
		return drag && !this.accepts(type);
	},


	accepts (type) {
		let criteria = ArrayUtils.ensure(this.props.accepts);

		return criteria.reduce((yes, x) => {
			return yes || (x === type) || (x.accepts && x.accepts(type));
		}, false);
	},


	getInitialState () {
		return {hover: false};
	},


	componentDidMount () {
		let mon = this.context.dndEvents;
		if (mon) {
			mon.on('drag', this[onDraggableNotification]);
			mon.on('dragEnd', this[onDragLeftDropTarget]);
			mon.on('drop', this[onDragDrop]);

		} else {
			console.error('DND: Missing cordination context'); //eslint-disable-line
		}
	},


	componentWillUnmount () {
		let mon = this.context.dndEvents;
		if (mon) {
			mon.removeListener('drag', this[onDraggableNotification]);
			mon.removeListener('dragEnd', this[onDragLeftDropTarget]);
			mon.removeListener('drop', this[onDragDrop]);
		}
	},


	renderDropTargetWrapper () {
		const {tag, children, className, ...otherProps} = this.props;
		delete otherProps.accepts;
		return React.createElement(tag || 'div', {...otherProps,
			ref: x => this.node = x,
			children,
			className: cx(className, this[getWrapperElementClassName]())
		});
	},


	[getWrapperElementClassName] () {
		return cx('dnd-drop-target', {
			active: this.isActive(),
			disabled: this.isDisabled(),
			over: this.state.over
		});
	},


	[onDraggableNotification] (dragData) {
		let {x, y} = dragData;
		if (!this.context.currentDragItem) { return; }

		if (isPointWithin(this.node, x, y)) {
			if (!this.state.over) {
				this[onDragEnteredDropTarget]();
			}
		} else {
			if (this.state.over) {
				this[onDragLeftDropTarget]();
			}
		}
	},


	[onDragEnteredDropTarget] () {
		if (this.context.currentDragItem) {
			this.setState({over: true});
			this.context.onDragOver(this);
		}
	},


	[onDragLeftDropTarget] () {
		this.setState({over: false});
		this.context.onDragOver(null, this);
	},


	[onDragDrop] (drop) {
		let {target} = drop;
		if(target === this && this.props.onDrop) {
			this.props.onDrop(drop);
		}
	},


	handleDrop () {
		if (!this.isActive()) {
			return;
		}

		let dropped = true;

		if (this.onDrop) {
			dropped = this.onDrop();
			//Prevent undefined/null values (no return statement) from interrupting the context callback
			dropped = dropped || (typeof dropped !== 'boolean' || dropped);
		}

		if (dropped && this.context.onDrop) {
			this.context.onDrop(this);
		}

		return dropped;
	}

};
