//heavily inspired by: https://github.com/mzabriskie/react-draggable

import React, {PropTypes} from 'react';
import Base, {TYPE_SHAPE} from './Base';

import isTouchDevice from 'nti.lib.interfaces/utils/is-touch-device';
import emptyFunction from 'react/lib/emptyFunction';


import {
	isMultiTouch,
	addEventListener as _addEventListener,
	removeEventListener as _removeEventListener,
	scrollElementBy,
	scrollParent as getScrollParent,
	getScrollPosition
} from '../../utils/dom';

import {getElementRect} from '../../utils/rects';

import {matches} from 'nti.lib.dom';

const addListeners = 'dnd:behaviours:draggable:addListeners';
const removeListeners = 'dnd:behaviours:draggable:removeListeners';

const eventFor = isTouchDevice ? {
	start: 'touchstart',
	move: 'touchmove',
	end: 'touchend'
} : {
	start: 'mousedown',
	move: 'mousemove',
	end: 'mouseup'
};

const DIRECTIONS = {
	'1': 1,
	'-1': -1,
	'Infinity': 1,
	'-Infinity': -1,
	'NaN': 0
};


function canDrag(x) {
	return function() {
		let {axis} = this.props;
		return axis === 'both' || axis === x;
	};
}


function getDragPoint(e) {
	e = (!e.touches ? e : e.touches[0]);
	let {clientX, clientY} = e;
	return {
		x: clientX,
		y: clientY
	};
}


function isDirection(dir, key, a, b) {
	if (!a || !b) {
		return null;
	}

	let dx = a[key] - b[key];

	dx = (dx / Math.abs(dx));

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
			startingScrollPosition: null,
			lastDragPoint: null
		};
	},


	getPosition () {
		let {x, y} = this.state;
		return {
			top: y,
			left: x
		};
	},


	componentDidMount () {
		this.scrollParent = getScrollParent(React.findDOMNode(this));
	},


	componentWillMount () {
		let {x, y} = this.props.start;
		this.setState({x: x, y: y});
	},


	componentWillUnmount () {this[removeListeners](); },


	[addListeners] () {
		_addEventListener(this.scrollParent, 'scroll', this.handleScroll);
		_addEventListener(global, eventFor.move, this.handleDrag);
		_addEventListener(global, eventFor.end, this.handleDragEnd);
	},


	[removeListeners] () {
		_removeEventListener(this.scrollParent, 'scroll', this.handleScroll);
		_removeEventListener(global, eventFor.move, this.handleDrag);
		_removeEventListener(global, eventFor.end, this.handleDragEnd);
	},


	handleDragStart (e) {
		let node = React.findDOMNode(this);
		let dragPoint = getDragPoint(e);
		let onDragStart = this.context.onDragStart || emptyFunction;
		let {handle, cancel} = this.props;
		let {scrollParent} = this;

		if (!this.isMounted() ||
			this.props.locked ||
			(handle && !matches(e.target, handle)) ||
			(cancel && matches(e.target, cancel))) {
			return;
		}

		//stop scrolls
		if (e.preventDefault) {
			e.preventDefault();
		}
		if (e.stopPropagation) {
			e.stopPropagation();
		}
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

		this[addListeners]();
	},


	handleDragEnd (e) {
		let onDragEnd = this.context.onDragEnd || emptyFunction;

		if (!this.state.dragging || !this.isMounted() || this.props.locked) {
			return;
		}

		let dragStopResultedInDrop = !onDragEnd(this, e, this.getPosition());

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

		this[removeListeners]();
	},


	handleDrag (e) {
		if (!this.isMounted() || this.props.locked) { return; }

		let s = this.state;
		let onDrag = this.context.onDrag || emptyFunction;
		let dragPoint = getDragPoint(e);
		let {lastDragPoint} = s;

		let x = (s.startX + (dragPoint.x - s.offsetX));
		let y = (s.startY + (dragPoint.y - s.offsetY));

		// Snap to grid?
		if (Array.isArray(this.props.grid)) {
			x = this.snapTo(x, 'x');
			y = this.snapTo(y, 'y');
		}

		this.setState({
			lastDragPoint: dragPoint,
			x: x,
			y: y
		});

		onDrag(this, e, Object.assign(this.getPosition(), dragPoint));

		this.maybeScrollParent(dragPoint, lastDragPoint);
	},


	handleScroll () {
		let {scrollParent} = this;
		let {
			startingScrollPosition,
			startX,
			startY
		} = this.state;
		let currentScrollPosition = getScrollPosition(scrollParent);

		let dX = (startingScrollPosition.left - currentScrollPosition.left) * -1;
		let dY = (startingScrollPosition.top - currentScrollPosition.top) * -1;

		this.setState({
			startX: startX + dX,
			startY: startY + dY,
			startingScrollPosition: currentScrollPosition
		});
	},


	maybeScrollParent (point, lastPoint) {
		let y, x;
		let region = 50;
		let {scrollParent} = this;
		let boundingRect = getElementRect(scrollParent);

		let top = (point.y - boundingRect.top) < region && isDirection(-1, 'y', point, lastPoint);
		let bottom = (boundingRect.bottom - point.y) < region && isDirection(1, 'y', point, lastPoint);


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


	snapTo (initial, axis) {
		let {props, state} = this;
		let {grid} = props;

		let axisInt = parseInt(state[axis], 10);
		let axId = axis === 'x' ? 0 : 1;
		let direction = initial < axisInt ? -1 : 1;

		return Math.abs(initial - axisInt) >= grid[axId] ?
				(axisInt + (grid[axId] * direction)) : state[axis];
	},


	computeStyle () {
		let s = this.state;
		let z = this.props.zIndex;
		let y = this.canDragY(this) ? s.y : s.startY;
		let x = this.canDragX(this) ? s.x : s.startX;
		let translation = `translate3d(${x}px,${y}px,0)`;
		let style = {
			WebkitTransform: translation,
			MozTransform: translation,
			msTransform: translation,
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
