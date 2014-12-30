'use strict';

var React = require('react/addons');

Object.assign(exports, {

	getInitialState: function() {
		return {
			currentDragItem: null
		};
	},


	childContextTypes: {
		//Common:
		currentDragItem: React.PropTypes.object,

		//For Draggable
		onDragStart: React.PropTypes.func,
		onDragStop: React.PropTypes.func,
		onDrag: React.PropTypes.func,

		//For Droppable
		lastDragOver: React.PropTypes.object,
		onDragOver: React.PropTypes.func,
		onDrop: React.PropTypes.func
	},


	getChildContext: function() {
		var s = this.state;
		return {
			currentDragItem: s.currentDragItem || null,
			lastDragOver: s.lastDragOver || null,

			onDragStart: this.__onDragStart,
			onDragStop: this.__onDragStop,
			onDrag: this.__onDrag,

			onDragOver: this.__onDragOver,
			onDrop: this.__onDrop
		};
	},


	__onDragStart: function(details) {
		this.setState({
			currentDragItem: details,
			lastDragOver: null
		});
	},


	__onDragStop: function() {
		var lastOver = this.state.lastDragOver || {};
		var {target} = lastOver;
		var dropped = false;

		if (target) {
			dropped = target.handleDrop();
		}

		this.setState({
			currentDragItem: null
		});

		return dropped;
	},


	__onDrag: function() {},


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

		if (this.onDrop) {
			this.onDrop(drop);
		}
	}
});
