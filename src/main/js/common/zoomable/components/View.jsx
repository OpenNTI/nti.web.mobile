import React from 'react';
import Store from '../Store';
import StoreEvents from 'common/mixins/StoreEvents';
import {SRC_CHANGED} from '../Constants';
import Point from '../Point';

function pointFromTouch(t) {
	return new Point(t.pageX, t.pageY, t.identifier);
}

let activeTouches = {};

export default React.createClass({
	displayName: 'Zoomable:View',

	mixins: [StoreEvents],

	backingStore: Store,
	backingStoreEventHandlers: {
		[SRC_CHANGED]: 'onSrcChange'
	},

	getInitialState () {
		return {
			src: null,
			startScale: 1.0,
			scale: 1.0,
			translate: Point.ORIGIN
		};
	},

	onSrcChange(event) {
		console.debug('src changed handler');
		if (event.src) {
			this.setState({
				src: event.src
			});
		}
	},

	close () {
		this.setState(this.getInitialState());
	},

	touchStart (evt) {
		// keep track of active touches.
		let touches = evt.changedTouches;
		for (let i = 0; i < touches.length; i++) {
			let p = pointFromTouch(touches[i]);
			activeTouches[p.id] = p;
		}
		if (touches.length > 1) {
			this.setTransformOrigin(pointFromTouch(touches[0]), pointFromTouch(touches[1]));
		}
	},

	setTransformOrigin(p1, p2) {
		let center = p1.middle(p2);
		this.setState({
			transformOrigin: center
		});
	},

	handleMultitouchMove(touches) {

		let t1 = pointFromTouch(touches[0]);
		let t2 = pointFromTouch(touches[1]);
		let ot1 = activeTouches[t1.id];
		let ot2 = activeTouches[t2.id];

		let od = ot1.minus(ot2);
		let nd = t1.minus(t2);

		let originalDistance = Math.sqrt(od.x * od.x + od.y * od.y);
		let newDistance = Math.sqrt(nd.x * nd.x + nd.y * nd.y);
		let startScale = this.state.startScale || 1.0;
		let scale = Math.max(newDistance / originalDistance * startScale, 1.0);

		this.setState({
			scale: scale
		});
	},

	limitOffset (offset) {

		let {scale, transformOrigin} = this.state;
		let containerRect = React.findDOMNode(this.refs.container).getBoundingClientRect();
		let imgRect = React.findDOMNode(this.refs.img).getBoundingClientRect();

		// img bounding rect without transforms (no scale, no translate)
		let topLeft = Point.ORIGIN;
		let bottomRight = topLeft.plus(new Point(imgRect.width / scale, imgRect.height / scale)); // the un-scaled values

		transformOrigin = transformOrigin || topLeft.middle(bottomRight);
		let transformedTopLeft = topLeft.scale(scale, transformOrigin).plus(offset);
		let transformedBottomRight = bottomRight.scale(scale, transformOrigin).plus(offset);

		console.debug(`transformedImageRect: (${transformedTopLeft}, ${transformedBottomRight})`);
		return offset;
	},

	handleSingleTouchMove (point) {
		// console.debug('single touch');
		let ot = activeTouches[point.id];
		if (!ot) {
			debugger;
		}
		let offset = point.minus(ot);
		offset = this.limitOffset(offset);
		this.setState({
			translate: {
				x: offset.x,
				y: offset.y
			}
		});

	},

	touchMove (evt) {
		let touches = evt.changedTouches;
		evt.preventDefault();
		if (touches.length > 1) {
			this.handleMultitouchMove(touches);
		}
		else if (Object.keys(activeTouches).length === 1) {
			this.handleSingleTouchMove(pointFromTouch(touches[0]));
		}
	},

	touchEnd (evt) {
		// stop tracking ended touches.
		let touches = evt.changedTouches;
		for (let i = 0; i < touches.length; i++) {
			let t = touches[i];
			delete activeTouches[t.identifier];
		}
		this.setState({
			startScale: this.state.scale || 1.0
		});
	},

	render () {
		if (!this.state.src) {
			return null;
		}
		let {scale, transformOrigin, translate} = this.state;
		scale = scale || 1.0;

		let style = {
			WebkitTransform: `translate3d(${translate.x}px, ${translate.y}px, 0) scale3d(${scale}, ${scale}, 1)`,
		};

		if (transformOrigin) {
			style.WebkitTransformOrigin = `${transformOrigin.x} ${transformOrigin.y}`;
		}

		return (
			<div>
				<div className="zoomable"
					ref="container"
					onTouchStart={this.touchStart}
					onTouchMove={this.touchMove}
					onTouchEnd={this.touchEnd}
				>
					<img src={this.state.src} style={style} ref="img" />
				</div>
				<button onClick={this.close}>close</button>
			</div>
		);
	}
});
