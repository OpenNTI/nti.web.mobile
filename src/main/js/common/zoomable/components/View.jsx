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
			src: null
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
		this.setState({
			src: null,
			startScale: 1.0,
			scale: 1.0
		});
	},

	touchStart (evt) {
		// keep track of active touches.
		let touches = evt.changedTouches;
		for (let i = 0; i < touches.length; i++) {
			let t = touches[i];
			activeTouches[t.identifier] = copyTouch(t);
		}
	},

	handleMultitouchMove(touches) {

		let t1 = touches[0];
		let t2 = touches[1];
		let ot1 = activeTouches[t1.identifier];
		let ot2 = activeTouches[t2.identifier];

		let pdelta = (p1, p2) => {
			return {
				x: p1.pageX - p2.pageX,
				y: p1.pageY - p2.pageY
			};
		};

		let od = pdelta(ot1, ot2);
		let nd = pdelta(t1, t2);

		let originalDistance = Math.sqrt(od.x * od.x + od.y * od.y);
		let newDistance = Math.sqrt(nd.x * nd.x + nd.y * nd.y);
		let startScale = this.state.startScale || 1.0;
		let scale = Math.max(newDistance / originalDistance * startScale, 1.0);

		this.setState({
			scale: scale
		});
	},

	touchMove (evt) {
		evt.preventDefault();
		let touches = evt.changedTouches;
		if (touches.length > 1) {
			this.handleMultitouchMove(touches);
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
		let {scale} = this.state;
		scale = scale || 1.0;
		let style = {
			WebkitTransform: `scale3d(${scale}, ${scale}, 1)`
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
