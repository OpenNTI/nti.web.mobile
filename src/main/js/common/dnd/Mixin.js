'use strict';

var React = require('react/addons');
var {EventEmitter} = require('events');

function emit(o, event, ...data) {
	var e = o.state.dndEventEmitter;
	e.emit.apply(e, [event].concat(data));
}


Object.assign(exports, {

	getInitialState: function() {
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


	getChildContext: function() {
		var s = this.state;
		return {
			dndEvents: s.dndEventEmitter,
			currentDragItem: s.currentDragItem || null,
			lastDragOver: s.lastDragOver || null,

			onDragStart: this.__onDragStart,
			onDragEnd: this.__onDragEnd,
			onDrag: this.__onDrag,

			onDragOver: this.__onDragOver,
			onDrop: this.__onDrop
		};
	},


	getNewUniqueToken: function () {
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

		var token = { accepts: (t)=> t === token };

		return token;
	},


	getNewCombinationToken: function (...tokens) {
		return {
			accepts: (t)=> tokens.filter(x=> x===t || x.accept(t)).length > 0
		};
	},


	__onDragStart: function(item) {
		this.setState({
			currentDragItem: item,
			lastDragOver: null
		});
		emit(this, 'dragStart');
	},


	__onDragEnd: function() {
		var lastOver = this.state.lastDragOver || {};
		var {target} = lastOver;
		var dropped = false;

		if (target) {
			dropped = target.handleDrop();
		}

		this.setState({
			currentDragItem: null
		});

		emit(this, 'dragEnd');
		return dropped;
	},


	__onDrag: function(draggable, event, data) {
		emit(this, 'drag', data);
	},


	__onDragOver: function (target) {
		this.setState({
			lastDragOver: {
				source: this.state.currentDragItem,
				target: target
			}
		});
	},


	__onDrop: function(target) {
		var drop = {
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
});
