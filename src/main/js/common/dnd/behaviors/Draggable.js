//heavily inspired by: https://github.com/mzabriskie/react-draggable

import {PropTypes} from 'react';
import {default as Base, TYPE_SHAPE} from './Base';

import isTouchDevice from 'nti.lib.interfaces/utils/is-touch-device';
import emptyFunction from 'react/lib/emptyFunction';


import {
	isMultiTouch,
	addEventListener as _addEventListener,
	removeEventListener as _removeEventListener,
	scrollElementBy,
	scrollParent,
	matches,
	getScrollPosition,
	getElementRect
} from '../../utils/dom';


var eventFor = isTouchDevice ? {
	start: 'touchstart',
	move: 'touchmove',
	end: 'touchend'
} : {
	start: 'mousedown',
	move: 'mousemove',
	end: 'mouseup'
};

var DIRECTIONS = {
	'1': 1,
	'-1': -1,
	'Infinity': 1,
	'-Infinity': -1,
	'NaN': 0
};


function canDrag(x) {
	return function() {
		var {axis} = this.props;
		return axis === 'both' || axis === x;
	};
}


function getDragPoint(e) {
	e = (!e.touches ? e : e.touches[0]);
	var {clientX, clientY} = e;
	return {
		x: clientX,
		y: clientY
	};
}


function isDirection(dir, key, a, b) {
	if (!a || !b) {
		return null;
	}

	var dx = a[key] - b[key];

	dx = (dx/Math.abs(dx));

	return DIRECTIONS[dx] === dir;
}


export default {
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
		 * `constrain` - Limit the dragging to the confines of a parent element.
		 */
		constrain: PropTypes.string,

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
		onDragEnd: PropTypes.func.isRequired,
		onDrag: PropTypes.func
	},


	getDefaultProps () {
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


	getInitialState () {
		return {
			dragging: false,
			restoring: false,
			startX: 0, startY: 0,
			offsetX: 0, offsetY: 0,
			x: 0, y: 0,
			scrollParent: null,
			startingScrollPosition: null,
			lastDragPoint: null
		};
	},


	getPosition () {
		var {x, y} = this.state;
		return {
			top: y,
			left: x
		};
	},


	componentDidMount () {
		this.setState({
			scrollParent: scrollParent(this.getDOMNode())
		});
	},


	componentWillMount () {
		var {x, y} = this.props.start;
		this.setState({x: x, y: y});
	},


	componentWillUnmount () {this._removeListeners(); },


	_addListeners () {
		_addEventListener(this.state.scrollParent, 'scroll', this.handleScroll);
		_addEventListener(global, eventFor.move, this.handleDrag);
		_addEventListener(global, eventFor.end, this.handleDragEnd);
	},


	_removeListeners () {
		_removeEventListener(this.state.scrollParent, 'scroll', this.handleScroll);
		_removeEventListener(global, eventFor.move, this.handleDrag);
		_removeEventListener(global, eventFor.end, this.handleDragEnd);
	},


	handleDragStart (e) {
		var node = this.getDOMNode();
		var dragPoint = getDragPoint(e);
		var onDragStart = this.context.onDragStart || emptyFunction;
		var {handle, cancel} = this.props;
		var {scrollParent} = this.state;

		if (!this.isMounted() ||
			this.props.locked ||
			(handle && !matches(e.target, handle)) ||
			(cancel && matches(e.target, cancel))) {
			return;
		}

		//stop scrolls
		if (e.preventDefault) {
			e.preventDefault(); }
		if (e.stopPropagation) {
			e.stopPropagation(); }
		e.returnValue = false;

		if (isMultiTouch(e)) {
		    this.handleDragEnd(e);
		    return;
		}

		this.setState({
			dragging: true,
			restoring: false,
			startingScrollPosition: getScrollPosition(scrollParent),
			lastDragPoint: dragPoint,
			offsetX: parseInt(dragPoint.x, 10),
			offsetY: parseInt(dragPoint.y, 10),
			startX: parseInt(node.style.left, 10) || 0,
			startY: parseInt(node.style.top, 10) || 0
		});


		onDragStart(this, e, this.getPosition());

		this._addListeners();
	},


	handleDragEnd (e) {
		var onDragEnd = this.context.onDragEnd || emptyFunction;

		if (!this.state.dragging || !this.isMounted() || this.props.locked) {
			return;
		}

		var dragStopResultedInDrop = !onDragEnd(this, e, this.getPosition());

		// The drop handler may result in us no longer being mounted, so check
		// that first (if we were unmounted, thats fine another instance of
		// ourself is probably in our place)
		if (this.isMounted()) {
			this.setState(
				Object.assign(
				{
					dragging: false,
					startX: 0,
					startY: 0
				},
				this.props.restoreOnStop ?
				{
					restoring: dragStopResultedInDrop,
					x: 0,
					y: 0
				} : {
				}
			));
		}

		this._removeListeners();
	},


	handleDrag (e) {
		if (!this.isMounted() || this.props.locked) { return; }

		var s = this.state;
		var onDrag = this.context.onDrag || emptyFunction;
		var dragPoint = getDragPoint(e);
		var {lastDragPoint} = s;

		var x = (s.startX + (dragPoint.x - s.offsetX));
		var y = (s.startY + (dragPoint.y - s.offsetY));

		// Snap to grid?
		if (Array.isArray(this.props.grid)) {
			x = this._snapTo(x, 'x');
			y = this._snapTo(y, 'y');
		}

		this.setState({
			lastDragPoint: dragPoint,
			x: x,
			y: y
		});

		onDrag(this, e, Object.assign(this.getPosition(), dragPoint));

		this._maybeScrollParent(dragPoint, lastDragPoint);
	},


	handleScroll () {
		var {
			scrollParent,
			startingScrollPosition,
			startX,
			startY
		} = this.state;
		var currentScrollPosition = getScrollPosition(scrollParent);

		var dX = (startingScrollPosition.left - currentScrollPosition.left) * -1;
		var dY = (startingScrollPosition.top - currentScrollPosition.top) * -1;

		this.setState({
			startX: startX + dX,
			startY: startY + dY,
			startingScrollPosition: currentScrollPosition
		});
	},


	_maybeScrollParent (point, lastPoint) {
		var y, x;
		var region = 50;
		var scrollParent = this.state.scrollParent;
		var boundingRect = getElementRect(scrollParent);

		var top = (point.y - boundingRect.top) < region && isDirection(-1, 'y', point, lastPoint);
		var bottom = (boundingRect.bottom - point.y) < region && isDirection(1, 'y', point, lastPoint);


		// scroll: Vertical
		if (top || bottom) {
			y = top ? -region : region;
		}

		// scroll: Horizontal
		// if (left || right) {
		// 	x = left ? -region : region;
		// }

		if (x || y) {
			scrollElementBy(scrollParent, x, y);
		}
	},


	_snapTo (initial, axis) {
		var {props, state} = this;
		var {grid} = props;

		var axisInt = parseInt(state[axis], 10);
		var axId = axis === 'x' ? 0 : 1;
		var direction = initial < axisInt ? -1 : 1;

		return Math.abs(initial - axisInt) >= grid[axId] ?
				(axisInt + (grid[axId] * direction)) : state[axis];
	},


	computeStyle () {
		var s = this.state;
		var z = this.props.zIndex;
		var y = this.canDragY(this) ? s.y : s.startY;
		var x = this.canDragX(this) ? s.x : s.startX;
		var translation = `translate3d(${x}px,${y}px,0)`;
		var style = {
			webkitTransform: translation,
			MozTransform: translation,
			msTransform: translation,
			OTransform: translation,
			transform: translation
		};

		if (s.dragging && !isNaN(z)) {
			style.zIndex = z;
		}

		return style;
	},


	getHandlers () {
		return {
			onMouseDown: this.handleDragStart,
			onTouchStart: this.handleDragStart,

			onMouseUp: this.handleDragEnd,
			onTouchEnd: this.handleDragEnd
		};
	}
};
