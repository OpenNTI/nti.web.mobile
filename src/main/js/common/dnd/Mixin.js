import React from 'react';
import {EventEmitter} from 'events';

function emit(o, event, ...data) {
	let e = o.state.dndEventEmitter;
	e.emit.apply(e, [event].concat(data));
}

const onDragStart = 'dnd:mixin:onDragStart';
const onDragEnd = 'dnd:mixin:onDragEnd';
const onDrag = 'dnd:mixin:onDrag';
const onDragOver = 'dnd:mixin:onDragOver';
const onDrop = 'dnd:mixin:onDrop';

export default {

	getInitialState () {
		return {
			currentDragItem: null,
			dndEventEmitter: new EventEmitter()
		};
	},


	childContextTypes: {
		//Common:
		currentDragItem: React.PropTypes.object,
		dndEvents: React.PropTypes.object,

		//For Draggable
		onDragStart: React.PropTypes.func,
		onDragEnd: React.PropTypes.func,
		onDrag: React.PropTypes.func,

		//For Droppable
		lastDragOver: React.PropTypes.object,
		onDragOver: React.PropTypes.func,
		onDrop: React.PropTypes.func
	},


	getChildContext () {
		let s = this.state;
		return {
			dndEvents: s.dndEventEmitter,
			currentDragItem: s.currentDragItem || null,
			lastDragOver: s.lastDragOver || null,

			onDragStart: this[onDragStart],
			onDragEnd: this[onDragEnd],
			onDrag: this[onDrag],

			onDragOver: this[onDragOver],
			onDrop: this[onDrop]
		};
	},


	getNewUniqueToken () {
		// This looks confusing, I know. This `token`
		// object is passed as a value to the DragTarget
		// accepts prop. Its also set to the type prop
		// of the Draggable. When a Draggable is over a
		// DropTarget, the DropTarget compares the
		// Draggable's type with its accepts list, if
		// it accepts it, the DropTarget will let the
		// Draggable drop onto it.
		//
		// The accepts function on this new instance of
		// an anonymouse object will test if the argument
		// passed to it is the exact same object as `token`.

		let token = { accepts: (t)=> t === token };

		return token;
	},


	getNewCombinationToken (...tokens) {
		return {
			accepts: (t)=> tokens.filter(x=> x === t || x.accepts(t)).length > 0
		};
	},


	[onDragStart] (item) {
		this.setState({
			currentDragItem: item,
			lastDragOver: null
		});
		emit(this, 'dragStart');
	},


	[onDragEnd] () {
		let lastOver = this.state.lastDragOver || {};
		let {target} = lastOver;
		let dropped = false;

		if (target) {
			dropped = target.handleDrop();
		}

		this.setState({
			currentDragItem: null
		});

		emit(this, 'dragEnd');
		return dropped;
	},


	[onDrag] (draggable, event, data) {
		emit(this, 'drag', data);
	},


	[onDragOver] (target, sender) {
		let last = this.state.lastDragOver || {};
		let lastTarget = last.target;

		if (!target && lastTarget && lastTarget !== sender) {
			return;
		}

		this.setState({
			lastDragOver: {
				source: this.state.currentDragItem,
				target: target
			}
		});
	},


	[onDrop] (target) {
		let drop = {
			source: this.state.currentDragItem,
			target: target
		};

		this.setState({
			lastDragOver: null
		});

		emit(this, 'drop', drop);

		if (this.onDrop) {
			this.onDrop(drop);
		}
	}
};
