import React from 'react';
import Point from '../Point';

function pointFromTouch(t) {
	return new Point(t.pageX, t.pageY, t.identifier);
}

let activeTouches = {};

export default React.createClass({
	displayName: 'Zoomable:View',

	propTypes: {
		src: React.PropTypes.string,
		onClose: React.PropTypes.func
	},

	getInitialState () {
		return {
			src: null,
			startScale: 1.0,
			scale: 1.0,
			translate: Point.ORIGIN,
			startOffset: Point.ORIGIN
		};
	},

	close () {
		activeTouches = {};
		this.setState(this.getInitialState());
		if (this.props.onClose) {
			this.props.onClose();
		}
	},

	touchStart (evt) {
		// keep track of active touches.
		let touches = evt.changedTouches;
		for (let i = 0; i < touches.length; i++) {
			let p = pointFromTouch(touches[i]);
			activeTouches[p.id] = p;
		}
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

		let offset = this.constrainOffsets();

		this.setState({
			scale: scale,
			translate: offset
		});
	},

	constrainOffsets(offset=this.state.translate) {
		let containerRect = React.findDOMNode(this.refs.container).getBoundingClientRect();
		let imgRect = React.findDOMNode(this.refs.img).getBoundingClientRect();
		let widthDiff = imgRect.width - containerRect.width;
		let maxPanX = widthDiff > 0 ? widthDiff / 2 : 0;

		let heightDiff = imgRect.height - containerRect.height;
		let maxPanY = heightDiff > 0 ? heightDiff / 2 : 0;
		offset.x = Math.max(Math.min(offset.x, maxPanX), -maxPanX);
		offset.y = Math.max(Math.min(offset.y, maxPanY), -maxPanY);
		return offset;
	},

	handleSingleTouchMove (point) {
		let ot = activeTouches[point.id];
		let offset = point.minus(ot).plus(this.state.startOffset);
		offset = this.constrainOffsets(offset);
		this.setState({
			translate: offset
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
			startScale: this.state.scale || 1.0,
			startOffset: this.state.translate || Point.ORIGIN
		});
	},

	render () {
		let {src} = this.props;
		if (!src) {
			return null;
		}
		let {scale, transformOrigin, translate} = this.state;
		scale = scale || 1.0;

		let style = {
			WebkitTransform: `translate3d(${translate.x}px, ${translate.y}px, 0) scale3d(${scale}, ${scale}, 1)`
		};

		if (transformOrigin) {
			style.WebkitTransformOrigin = `${transformOrigin.x}px ${transformOrigin.y}px`;
		}

		return (
				<div className="zoomable"
					ref="container"
					onTouchStart={this.touchStart}
					onTouchMove={this.touchMove}
					onTouchEnd={this.touchEnd}
				>
					<img src={src} style={style} ref="img" className="zoomable-img" />
					<button className="zoomable-close" onClick={this.close}></button>
				</div>
		);
	}
});
