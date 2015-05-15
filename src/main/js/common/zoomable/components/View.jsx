import React from 'react';
import Store from '../Store';
import StoreEvents from 'common/mixins/StoreEvents';
import {SRC_CHANGED} from '../Constants';

function copyTouch(touch) {
	return {
		identifier: touch.identifier,
		pageX: touch.pageX,
		pageY: touch.pageY
	};
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
			transformOrigin: {
				x: '50%',
				y: '50%'
			},
			translate: {
				x: 0,
				y: 0
			}
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
			let t = touches[i];
			activeTouches[t.identifier] = copyTouch(t);
		}
		if (touches.length > 1) {
			this.setTransformOrigin(touches[0], touches[1]);
		}
	},

	setTransformOrigin(touch1, touch2) {
		let asPoint = p => {
			return {
				x: p.pageX,
				y: p.pageY
			};
		};
		let p1 = asPoint(touch1);
		let p2 = asPoint(touch2);
		let center = this.findCenter(p1, p2);
		this.setState({
			transformOrigin: center
		});
	},

	/**
	* Returns a point halfway between the two given points
	* @param {Object} p1 First point
	* @param {Object} p2 Second point
	* @returns {Object} the point halfway between p1 and p2
	*/
	findCenter(p1, p2) {
		return {
			x: (p2.x - p1.x) / 2 + p1.x,
			y: (p2.y - p1.y) / 2 + p1.y
		};
	},

	/**
	* Returns a new point which is the sum of the two given
	* @param {Object} p1 the starting point
	* @param {Object} offset the offset
	* @returns {Object} The sum of the two points
	*/
	addPoints(p1, offset) {
		return {
			x: p1.x + offset.x,
			y: p1.y + offset.y
		};
	},

	touchDelta(touch1, touch2) {
		return {
			x: touch1.pageX - touch2.pageX,
			y: touch1.pageY - touch2.pageY
		};
	},

	handleMultitouchMove(touches) {

		let t1 = touches[0];
		let t2 = touches[1];
		let ot1 = activeTouches[t1.identifier];
		let ot2 = activeTouches[t2.identifier];

		let od = this.touchDelta(ot1, ot2);
		let nd = this.touchDelta(t1, t2);

		let originalDistance = Math.sqrt(od.x * od.x + od.y * od.y);
		let newDistance = Math.sqrt(nd.x * nd.x + nd.y * nd.y);
		let startScale = this.state.startScale || 1.0;
		let scale = Math.max(newDistance / originalDistance * startScale, 1.0);
		console.log(`scale: ${scale}`);
		this.setState({
			scale: scale
		});
	},

	handleSingleTouchMove (touch) {
		console.debug('single touch');
		let ot = activeTouches[touch.identifier];
		let offset = this.touchDelta(touch, ot);
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
			this.handleSingleTouchMove(touches[0]);
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
		console.log('render');
		if (!this.state.src) {
			return null;
		}
		let {scale, transformOrigin, translate} = this.state;
		scale = scale || 1.0;
		console.debug(`transformOrigin: (${transformOrigin.x}, ${transformOrigin.y})`);
		let style = {
			WebkitTransformOrigin: `${transformOrigin.x} ${transformOrigin.y}`,
			WebkitTransform: `scale3d(${scale}, ${scale}, 1) translate3d(${translate.x}px, ${translate.y}px, 0)`,
		};
		return (
			<div>
				<div className="zoomable"
					onTouchStart={this.touchStart}
					onTouchMove={this.touchMove}
					onTouchEnd={this.touchEnd}
				>
					<img src={this.state.src} style={style} />
				</div>
				<button onClick={this.close}>close</button>
			</div>
		);
	}
});
