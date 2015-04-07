import React from 'react';

import WidgetsMixin from './Mixin';

import ErrorWidget from 'common/components/Error';
import Loading from 'common/components/Loading';

export default React.createClass({
	displayName: 'CourseOverviewVideos',
	mixins: [WidgetsMixin],

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.ntivideoset/i,
		handles (item) {
			return this.mimeTest.test(item.MimeType);
		}
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


	componentDidUpdate (_, prevState) {
		let node = this.refs.v && this.refs.v.getDOMNode();
		let {offsetWidth} = node || {};
		if (prevState.offsetWidth !== offsetWidth) {
			this.setState({offsetWidth});
		}
	},


	onError (error) {
		if (this.isMounted()) {
			this.setState({
				loading: false,
				error: error,
				data: null
			});
		}
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
		let refs = this.refs;
		let key;
		for(key in refs) {
			if (key.indexOf('CourseOverviewVideo-') === 0) {
				refs[key].stop();
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
		let touch = event.targetTouches[0];

		let active = this.state.active;
		let videos = this.refs.v;
		let pixelOffset = 0;
		if (videos) {
			videos = videos.getDOMNode();
			pixelOffset = active * -videos.offsetWidth;
		}

		if (!this.state.touch) {
			e.stopPropagation();
			console.debug('Touch Start...');
			this.setState({
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


		let me = this;
		let state = me.state;
		let data = state.touch;
		let find = (t, i) =>t || (i.identifier === state.touch.id && i);
		if (!data) {
			console.debug('No touch data...ignoring.');
			return;
		}

		let active = state.active;
		let touch = Array.from(e.targetTouches || []).reduce(find, null);
		let sliding = data.sliding;
		let pixelOffset = data.pixelOffset;
		let startPixelOffset = data.startPixelOffset;
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
				console.debug('Touch move tripped...');
			}

			if (sliding === 2) {
				if ((active === 0 && event.clientX > data.x) ||
					(active === (me.getVideoList().length - 1) && event.clientX < data.x)) {
					touchPixelRatio = 3;
				}

				pixelOffset = startPixelOffset + (delta / touchPixelRatio);

				// console.debug('Touch move... %d %d %d', startPixelOffset, pixelOffset, delta);
				me.setState({
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

		let pixelOffset = touch.pixelOffset;
		let startPixelOffset = touch.startPixelOffset;
		let fn;

		if (touch.sliding === 2) {
			e.preventDefault();
			e.stopPropagation();

			fn = (Math.abs(pixelOffset - startPixelOffset) / touch.dom.offsetWidth) > 0.35 ? null ://elastic
				pixelOffset < startPixelOffset ? 'onNext' : 'onPrev';

			console.debug('Touch End, result: %s', fn || 'stay');

			if(fn) {
				this[fn]();
			}
			this.setState({ touch: null	});
		}
	},


	getTranslation () {
		let {active, touch, offsetWidth} = this.state;
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
				<button className="prev fi-arrow-left" onClick={this.onPrev} title="Prevous Video"/>
				<button className="next fi-arrow-right" onClick={this.onNext} title="Next Video"/>
				<ul className="videos-carousel-dots">
					{this.renderDots()}
				</ul>
			</div>
		);
	},


	renderCarousel () {
		let touching = !!this.state.touch;
		let animateChanges = touching ? '' : 'animate';
		let translation = this.getTranslation();

		let props = {
			tabIndex: '0',
			ref: 'v',
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
			return (<li key={'video-' + i}><a className={active} href={"#" + i}
				onClick={this.onActivateSlide} data-index={i}/></li>);
		});
	}
});
