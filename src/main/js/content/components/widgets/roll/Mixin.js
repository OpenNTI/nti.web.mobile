import CSS from 'fbjs/lib/CSSCore';
import ReactTransitionEvents from 'react/lib/ReactTransitionEvents';
import Logger from 'nti-util-logger';
import {getEventTarget} from 'nti-lib-dom';

const logger = Logger.get('content:components:widgets:roll:Mixin');

export const stop = e => { e.preventDefault(); e.stopPropagation(); };

function getTouch (e, id) {
	return Array.from(e.targetTouches || [])
		.find(i=>i.identifier === id);
}

export default {

	getInitialState () {
		return {
			current: 0
		};
	},


	componentDidUpdate (_, prevState) {
		let last = prevState ? prevState.current : 0;
		let current = this.getActiveIndex();
		let ref = 'thumbnail' + current;

		if (last !== current) {
			let node = this[ref];
			if (node) {
				//subtract the width to keep it centered when it can be.
				node.parentNode.scrollLeft = (node.offsetLeft - node.offsetWidth);
			}

		}
	},


	getActiveIndex () {
		let {current = 0} = this.state;
		return current;
	},


	onThumbnailClick (e) {
		stop(e);
		let attr = 'data-index';
		let index = getEventTarget(e, `[${attr}]`);
		if (index) {
			index = parseInt(index.getAttribute(attr), 10);
			this.setState({current: index});
		}
	},


	onStay (e) { this.go(e, 0); },
	onPrev (e) { this.go(e, -1); },
	onNext (e) { this.go(e, 1); },


	go (e, n, cb) {
		if (e) {
			stop(e);
			e.target.blur();
		}

		let total = this.getItemCount();
		let index = this.getActiveIndex();
		let next = index + n;

		let {stage, current} = this;

		if (next >= 0 && next < total) {
			index = next;
		}

		let action = (n === 0 || next !== index) ? 'stay' : n < 0 ? 'prev' : 'next';

		let finish = ()=> this.setState({
			current: index,
			touch: void 0,
			touchEnd: void 0
		}, ()=> cb && cb());


		let transitionEnded = () => {
			ReactTransitionEvents.removeEndEventListener(current, transitionEnded);
			CSS.removeClass(stage, 'transitioning');
			CSS.removeClass(stage, action);
			finish();
			stage = null;//flag we've already run.
		};


		if (!stage) {
			return finish();
		}


		ReactTransitionEvents.addEndEventListener(current, transitionEnded);

		CSS.addClass(stage, 'transitioning');

		setTimeout(() => {
			this.setState({touchEnd: {}}, () => {
				if (stage) {//we may execute out of order... so if the transitionEnded function executes first, don't add the class.
					CSS.addClass(stage, action);
				}
			});
		}, 0);
	},


	onTouchStart (e) {
		let {touch, touchEnd} = this.state;

		if (!touch && !touchEnd) {
			touch = e.targetTouches[0];

			e.stopPropagation();

			const {stage} = this;

			// logger.debug('Touch Start...');

			this.setState({
				touch: {
					targetWidth: stage.offsetWidth,
					pixelOffset: 0,
					startPixelOffset: 0,

					x: touch.clientX,
					y: touch.clientY,

					id: touch.identifier,

					sliding: 1,
					delta: 0
				}
			});
		}
		else {
			logger.debug('Ignored Touch Start...');
		}
	},


	onTouchMove (e) {
		let {state} = this;

		let data = state.touch;

		let {sliding, pixelOffset, startPixelOffset, targetWidth} = data;

		if (!data) {
			logger.debug('No touch data...ignoring.');
			return;
		}


		let touch = getTouch(e, state.touch.id);


		let delta = 0;
		let touchPixelRatio = 1;

		if (touch) {
			e.stopPropagation();

			//Allow vertical scrolling
			if (Math.abs(touch.clientY - data.y) > Math.abs(touch.clientX - data.x)) {
				return;
			}

			e.preventDefault();

			delta = touch.clientX - data.x;

			if (sliding === 1 && delta) {
				sliding = 2;

				startPixelOffset = pixelOffset;

				// logger.debug('Touch move tripped...');
			}

			if (sliding === 2) {

				pixelOffset = startPixelOffset + (delta / touchPixelRatio);

				let sign = pixelOffset / Math.abs(pixelOffset);

				if(Math.abs(pixelOffset) > targetWidth) {
					pixelOffset = sign * targetWidth;
				}

				this.setState({
					touch: Object.assign(state.touch,
						{ delta, pixelOffset, startPixelOffset, sliding })
				});
			}
		}
	},


	onTouchEnd (e) {

		let {touch = {}} = this.state;

		let endedTouch = getTouch(e, touch.id);

		let {sliding, pixelOffset, startPixelOffset, targetWidth} = touch;

		let fn;

		if (sliding === 2) {
			stop(e);

			fn = (Math.abs(pixelOffset - startPixelOffset) / targetWidth) < 0.35 ? 'onStay' ://elastic
				pixelOffset < startPixelOffset ? 'onNext' : 'onPrev';

			//logger.debug('Touch End, result: %s', fn || 'stay');

			this.setState({touchEnd: {pixelOffset, targetWidth}}, ()=> this[fn] && this[fn]());
		}


		if (endedTouch || e.targetTouches.length === 0) {
			this.setState({ touch: void 0 });
		} else {
			logger.debug('Not my touch', touch.id, e.targetTouches);
		}

	}
};
