import React from 'react';

import Logger from 'nti-util-logger';

import WidgetsMixin from './Mixin';

import ErrorWidget from 'common/components/Error';
import Loading from 'common/components/Loading';

const logger = Logger.get('course:components:widgets:Videos');

export default React.createClass({
	displayName: 'CourseOverviewVideos',
	mixins: [WidgetsMixin],

	statics: {
		mimeTest: /(videoset|videoroll)/i,
		handles (item) {
			return this.mimeTest.test(item.MimeType);
		}
	},


	propTypes: {
		outlineId: React.PropTypes.string.isRequired,
		item: React.PropTypes.object.isRequired
	},


	getInitialState () {
		return {
			active: 0,
			loading: true,
			error: false,
			pixelOffset: 0
		};
	},


	componentDidMount () {
		this.getDataIfNeeded(this.props);
	},


	componentWillReceiveProps (nextProps) {
		if (nextProps.outlineId !== this.props.outlineId) {
			this.getDataIfNeeded(nextProps);
		}
	},


	componentDidUpdate () {
		const {videos, state: {offsetWidth}} = this;
		const renderedOffsetWidth = videos && videos.offsetWidth;
		if (offsetWidth !== renderedOffsetWidth) {
			this.setState({offsetWidth: renderedOffsetWidth});//eslint-disable-line react/no-did-update-set-state
		}
	},


	onError (error) {
		this.setState({
			loading: false,
			error: error,
			data: null
		});
	},


	getDataIfNeeded (props) {
		try {
			this.setState(this.getInitialState());
			props.course.getVideoIndex()
				.then(data=>
					this.setState({loading: false, data})
				)
				.catch(this.onError);
		}
		catch(e) {
			this.onError(e);
		}
	},


	stopVideo () {
		for(let key of Object.keys(this)) {
			if (key.indexOf('container-item-') === 0 && this[key].stop) {
				this[key].stop();
			}
		}
	},


	onNext (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		let active = this.state.active;
		this.stopVideo();
		this.setState({
			touch: null,
			active: Math.min(active + 1, this.getVideoList().length - 1)
		});
	},


	onPrev (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		let active = this.state.active;
		this.stopVideo();
		this.setState({
			touch: null,
			active: Math.max(active - 1, 0)
		});
	},


	onActivateSlide (e) {
		e.preventDefault();
		e.stopPropagation();
		let newActive = parseInt(e.target.getAttribute('data-index'), 10);
		this.stopVideo();
		this.setState({
			touch: null,
			active: newActive
		});
	},


	onTouchStart (e) {
		let touch = e.targetTouches[0];

		let active = this.state.active;
		let videos = this.videos;
		let pixelOffset = 0;

		if (videos) {
			pixelOffset = active * -videos.offsetWidth;
		}

		if (!this.state.touch) {
			e.stopPropagation();
			logger.debug('Touch Start...');
			this.setState({
				offsetWidth: videos.offsetWidth,
				touch: {
					dom: videos,
					pixelOffset: pixelOffset,
					startPixelOffset: 0,
					x: touch.clientX,
					y: touch.clientY,
					id: touch.identifier,
					sliding: 1,
					delta: 0
				}
			});
		}
	},


	onTouchMove (e) {

		let {state} = this;
		let {active, touch} = state;
		let data = touch;

		let find = (t, i) =>t || (i.identifier === state.touch.id && i);

		if (!data) {
			logger.debug('No touch data...ignoring.');
			return;
		}

		touch = Array.from(e.targetTouches || []).reduce(find, null);

		let {sliding, pixelOffset, startPixelOffset} = data;

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
				logger.debug('Touch move tripped...');
			}

			if (sliding === 2) {
				if ((active === 0 && e.clientX > data.x) ||
					(active === (this.getVideoList().length - 1) && e.clientX < data.x)) {
					touchPixelRatio = 3;
				}

				pixelOffset = startPixelOffset + (delta / touchPixelRatio);

				// logger.debug('Touch move... %d %d %d', startPixelOffset, pixelOffset, delta);
				this.setState({
					touch: Object.assign(state.touch, {
						delta: delta,
						pixelOffset: pixelOffset,
						startPixelOffset: startPixelOffset,
						sliding: sliding
					})
				});
			}
		}
	},


	onTouchEnd (e) {

		let touch = this.state.touch || {};

		let find = (t, i) =>t || (i.identifier === touch.id && i);

		let endedTouch = Array.from(e.targetTouches || []).reduce(find, null);

		let {pixelOffset, startPixelOffset} = touch;

		let fn;

		if (touch.sliding === 2) {
			e.preventDefault();
			e.stopPropagation();

			fn = (Math.abs(pixelOffset - startPixelOffset) / touch.dom.offsetWidth) < 0.35 ? null ://elastic
				pixelOffset < startPixelOffset ? 'onNext' : 'onPrev';

			logger.debug('Touch End, result: %s', fn || 'stay');

			if(fn) {
				this[fn]();
			}

			this.setState({ touch: null	});
		}

		if (endedTouch || e.targetTouches.length === 0) {
			this.setState({ touch: null	});
		} else {
			logger.debug('Not my touch', touch.id, e.targetTouches);
		}
	},


	getTranslation () {
		let {active = 0, touch, offsetWidth = 0} = this.state;
		let offset = touch ?
				touch.pixelOffset :
				(active * -offsetWidth);

		return 'translate3d(' + offset + 'px,0,0)';
	},


	getVideoList () {
		return this.props.item.Items;
	},


	render () {
		if (this.state.loading) { return (<Loading/>); }
		if (this.state.error) {	return (<ErrorWidget error={this.state.error}/>); }

		return (
			<div className="videos-carousel-container">
				{this.renderCarousel()}
				<button className="prev icon-chevron-left" onClick={this.onPrev} title="Prevous Video"/>
				<button className="next icon-chevron-right" onClick={this.onNext} title="Next Video"/>
				<ul className="videos-carousel-dots">
					{this.renderDots()}
				</ul>
			</div>
		);
	},


	renderCarousel () {
		let {touch} = this.state;
		let touching = (touch && touch.sliding !== 1);
		let animateChanges = touching ? '' : 'animate';
		let translation = this.getTranslation();

		let props = {
			tabIndex: '0',
			ref: x => this.videos = x,
			style: {
				WebkitTransform: translation,
				MozTransform: translation,
				msTransform: translation,
				transform: translation
			},
			className: 'videos-carousel ' + animateChanges,
			onTouchStart: this.onTouchStart,
			onTouchMove: this.onTouchMove,
			onTouchEnd: this.onTouchEnd
		};

		return React.createElement('ul', props,
			...this.renderItems(this.getVideoList(), {
				tag: 'li',
				activeIndex: this.state.active,
				touching
			}));

	},


	renderDots () {
		return this.getVideoList().map((_, i) => {
			let active = (i === (this.state.active || 0)) ? 'active' : null;
			return (<li key={'video-' + i}><a className={active} href={'#' + i}
				onClick={this.onActivateSlide} data-index={i}/></li>);
		});
	}
});
