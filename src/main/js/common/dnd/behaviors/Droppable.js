import React from 'react';
import ReactDOM from 'react-dom';
import ensureArray from 'nti.lib.interfaces/utils/ensure-array';
import {isPointWithIn} from '../../utils/dom';
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
		let criteria = ensureArray(this.props.accepts);

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
			console.error('DND: Missing cordination context');
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


	renderDropTargetWrapper (children) {
		return React.createElement(this.props.tag || 'div', Object.assign({}, this.props, {
			children: children,
			className: this[getWrapperElementClassName]()
		}));
	},


	[getWrapperElementClassName] () {
		let classes = ['dnd-drop-target'];
		let push = classes.push.bind(classes);

		if (this.isActive()) { push('active'); }
		if (this.isDisabled()) { push('disabled'); }
		if (this.state.over) { push('over'); }
		if (this.props.className) { push(this.props.className); }

		return classes.join(' ');
	},


	[onDraggableNotification] (dragData) {
		let {x, y} = dragData;
		if (!this.isMounted() || !this.context.currentDragItem) { return; }

		if (isPointWithIn(ReactDOM.findDOMNode(this), x, y)) {
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
