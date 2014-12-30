'use strict';

var React = require('react/addons');

Object.assign(exports, {

	getInitialState: function() {
		return {
			currentDragItem: null
		};
	},

	childContextTypes: {
		currentDragItem: React.PropTypes.object,
		onDragStart: React.PropTypes.func,
		onDragStop: React.PropTypes.func,
		onDrag: React.PropTypes.func,
		onDrop: React.PropTypes.func
	},


	getChildContext: function() {
		return {
			currentDragItem: this.state.currentDragItem || null,
			onDragStart: this.onDragStart,
			onDragStop: this.onDragStop,
			onDrag: this.onDrag,
			onDrop: this.onDrop
		};
	},


	onDragStart: function(details) {
		console.log('Drag Started');
		return this.setState({
			currentDragItem: details
		});
	},


	onDragStop: function() {
		console.log('Drag Stopped');
		return this.setState({
			currentDragItem: null
		});
	},


	onDrag: function() {
	},


	onDrop: function(target) {
		return this.setState({
			lastDrop: {
				source: this.state.currentDragItem,
				target: target
			}
		});
	}
});
