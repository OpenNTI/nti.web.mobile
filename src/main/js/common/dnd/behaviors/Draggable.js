'use strict';

var isTouchDevice = require('dataserverinterface/utils/is-touch-device');

//heavily inspired by: https://github.com/mzabriskie/react-draggable

var React = require('react/addons');
var emptyFunction = require('react/lib/emptyFunction');
var {PropTypes} = React;


var {Dom} = require('../../Utils');

var {isMultiTouch} = Dom;

var Base = require('./Base');

var {TYPE_SHAPE} = Base;

var eventFor = isTouchDevice ? {
	start: 'touchstart',
	move: 'touchmove',
	end: 'touchend'
} : {
	start: 'mousedown',
	move: 'mousemove',
	end: 'mouseup'
};


function canDrag(x) {
	return function() {
		var {axis} = this.props;
		return axis === 'both' || axis === x;
	};
}


function getDragPoint(e) {
	e = (!isTouchDevice ? e : e.touches[0]);
	var {clientX, clientY} = e;
	return {clientX: clientX, clientY: clientY}; }


Object.assign(exports, {
	mixins: [Base],

	canDragY: canDrag('y'),
	canDragX: canDrag('x'),


	propTypes: {
		type: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.shape(TYPE_SHAPE)
			]).isRequired,


		restoreOnStop: PropTypes.bool,


		locked: PropTypes.bool,


		/**
		 * `axis` - which axis to update.
		 */
		axis: PropTypes.oneOf(['both', 'x', 'y']),

		/**
		 * `handle` - an optional selector to focus drag events on a specific part of the draggable.
		 */
		handle: PropTypes.string,

		/**
		 * `cancel` - an optional selector to prevent drag on parts of the draggable.
		 */
		cancel: PropTypes.string,

		/**
		 * `grid` defines drag snap stops.
		 */
		grid: PropTypes.arrayOf(PropTypes.number),

		/**
		 * `start` - the initial x and y.
		 */
		start: PropTypes.shape({
			x: PropTypes.number,
			y: PropTypes.number
		}),

		/**
		 * `zIndex` - the z-index to use while dragging.
		 */
		zIndex: PropTypes.number
	},


	contextTypes: {
		currentDragItem: PropTypes.object,
		onDragStart: PropTypes.func.isRequired,
		onDragStop: PropTypes.func.isRequired,
		onDrag: PropTypes.func
	},


	getDefaultProps: function() {
		return {
			restoreOnStop: true,
			axis: 'both',
			handle: null,
			cancel: null,
			grid: null,
			start: {
				x: 0,
				y: 0
			},
			zIndex: 9999
		};
	},


	getInitialState: function () {
		return {
			dragging: false,
			restoring: false,
			startX: 0, startY: 0,
			offsetX: 0, offsetY: 0,
			clientX: 0, clientY: 0
		};
	},


	getPosition: function() {
		var {clientX, clientY} = this.state;
		return { position: {
			top: clientY,
			left: clientX
		}};
	},


	componentWillMount: function() {
		var {x, y} = this.props.start;
		this.setState({clientX: x, clientY: y});
	},


	componentWillUnmount: function() {
		Dom.removeEventListener(global, eventFor.move, this.handleDrag);
		Dom.removeEventListener(global, eventFor.end, this.handleDragEnd);
	},


	handleDragStart: function (e) {
		if (!this.isMounted() || this.props.locked) { return; }

		e.preventDefault();//stop scrolls

		if (isMultiTouch(e)) {
		    this.handleDragEnd(e);
		    return;
		}

		var node = this.getDOMNode();
		var dragPoint = getDragPoint(e);
		var onDragStart = this.context.onDragStart || emptyFunction;
		var {handle, cancel} = this.props;

		if ((handle && !Dom.matches(e.target, handle)) || (cancel && Dom.matches(e.target, cancel))) {
			return;
		}


		this.setState({
			dragging: true,
			restoring: false,
			offsetX: parseInt(dragPoint.clientX, 10),
			offsetY: parseInt(dragPoint.clientY, 10),
			startX: parseInt(node.style.left, 10) || 0,
			startY: parseInt(node.style.top, 10) || 0
		});


		onDragStart(this, e, this.getPosition());

		Dom.addEventListener(global, eventFor.move, this.handleDrag);
		Dom.addEventListener(global, eventFor.end, this.handleDragEnd);
	},


	handleDragEnd: function (e) {
		var onDragStop = this.context.onDragStop || emptyFunction;

		if (!this.state.dragging || !this.isMounted() || this.props.locked) {
			return;
		}

		var dragStopResultedInDrop = !onDragStop(this, e, this.getPosition());

		this.setState(
			Object.assign(
			{ dragging: false },
			this.props.restoreOnStop ?
			{
				restoring: dragStopResultedInDrop,
				clientX: this.state.startX,
				clientY: this.state.startY
			} : {
			}
		));

		Dom.removeEventListener(global, eventFor.move, this.handleDrag);
		Dom.removeEventListener(global, eventFor.end, this.handleDragEnd);
	},


	handleDrag: function (e) {
		if (!this.isMounted() || this.props.locked) { return; }

		var onDrag = this.context.onDrag || emptyFunction;
		var dragPoint = getDragPoint(e);

		var clientX = (this.state.startX + (dragPoint.clientX - this.state.offsetX));
		var clientY = (this.state.startY + (dragPoint.clientY - this.state.offsetY));

		// Snap to grid?
		if (Array.isArray(this.props.grid)) {
			clientX = this._snapTo(clientX, 'clientX');
			clientY = this._snapTo(clientY, 'clientY');
		}

		this.setState({
			clientX: clientX,
			clientY: clientY
		});

		onDrag(this, e, this.getPosition());
	},


	_snapTo: function (initial, axis) {
		var {props, state} = this;
		var {grid} = props;

		var axisInt = parseInt(state[axis], 10);
		var axId = axis === 'clientX' ? 0 : 1;
		var direction = initial < axisInt ? -1 : 1;

		return Math.abs(initial - axisInt) >= grid[axId] ?
				(axisInt + (grid[axId] * direction)) : state[axis];
	},


	computeStyle: function () {
		var s = this.state;
		var z = this.props.zIndex;
		var style = {
			top: this.canDragY(this) ? s.clientY : s.startY,
			left: this.canDragX(this) ? s.clientX : s.startX
		};

		if (s.dragging && !isNaN(z)) {
			style.zIndex = z;
		}

		return style;
	},


	getHandlers: function () {
		return {
			onMouseDown: this.handleDragStart,
			onTouchStart: this.handleDragStart,

			onMouseUp: this.handleDragEnd,
			onTouchEnd: this.handleDragEnd
		};
	}
});
