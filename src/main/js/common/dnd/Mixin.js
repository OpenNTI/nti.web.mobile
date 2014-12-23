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
		onDrop: React.PropTypes.func
	},


	getChildContext: function() {
		return {
			currentDragItem: this.state.currentDragItem || null,
			onDragStart: this.onDragStart,
			onDragStop: this.onDragStop,
			onDrop: this.onDrop
		};
	},


	onDragStart: function(details) {
		return this.setState({
			currentDragItem: details
		});
	},


	onDragStop: function() {
		return this.setState({
			currentDragItem: null
		});
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
