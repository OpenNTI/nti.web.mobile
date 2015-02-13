import React from 'react/addons';

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
			error: false
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


	componentDidUpdate () {},


	__onError (error) {
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
				.catch(this.__onError);
		}
		catch(e) {
			this.__onError(e);
		}
	},


	stopVideo () {
		var refs = this.refs;
		var key;
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
		var active = this.state.active;
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
		var active = this.state.active;
		this.stopVideo();
		this.setState({
			touch: null,
			active: Math.max(active - 1, 0)
		});
	},


	onActivateSlide (e) {
		e.preventDefault();
		e.stopPropagation();
		var newActive = parseInt(e.target.getAttribute('data-index'), 10);
		this.stopVideo();
		this.setState({
			touch: null,
			active: newActive
		});
	},


	onTouchStart (e) {
		var touch = event.targetTouches[0];

		var active = this.state.active;
		var videos = this.refs.v;
		var pixelOffset = 0;
		if (videos) {
			videos = videos.getDOMNode();
			pixelOffset = active * -videos.offsetWidth;
		}

		if (!this.state.touch) {
			e.stopPropagation();
			// console.debug('Touch Start...')
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

		let find = (t, i) =>t || (i.identifier === state.touch.id && i);

		var me = this;
		var state = me.state;
		var data = state.touch;
		if (!data) {
			console.debug('No touch data...ignoring.');
			return;
		}

		var active = state.active;
		var touch = Array.from(e.targetTouches||[]).reduce(find, null);
		var sliding = data.sliding;
		var pixelOffset = data.pixelOffset;
		var startPixelOffset = data.startPixelOffset;
		var delta = 0;
		var touchPixelRatio = 1;

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
				// console.debug('Touch move tripped...');
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


	onTouchEnd (/*e*/) {
		//e.stopPropagation();

		var touch = this.state.touch || {};

		var pixelOffset = touch.pixelOffset;
		var startPixelOffset = touch.startPixelOffset;
		var fn;

		if (touch.sliding === 2) {
			fn = //(Math.abs(pixelOffset - startPixelOffset)/touch.dom.offsetWidth) > 0.2 ? null ://elastic
				pixelOffset < startPixelOffset ? 'onNext' : 'onPrev';

			// console.debug('Touch End, result: %s', fn);

			if(fn) {
				this[fn]();
			}
			this.setState({ touch: null	});
		}
	},


	getTranslation () {
		var active = this.state.active;
		var touch = this.state.touch;
		var node = this.refs.v && this.refs.v.getDOMNode();
		var offset = touch ? touch.pixelOffset :
				node ? (active * -node.offsetWidth) : 0;

		return 'translate3d(' + offset + 'px,0,0)';
	},


	getVideoList () {
		return this.props.item.Items;
	},


	render () {
		if (this.state.loading) { return (<Loading/>); }
		if (this.state.error) {	return (<ErrorWidget error={this.state.error}/>);}

		var animate = this.state.touch ? '' : 'animate';
		var translation = this.getTranslation();
		var style = {
			webkitTransform: translation,
			MozTransform: translation,
			msTransform: translation,
			OTransform: translation,
			transform: translation
		};

		return (
			<div className="videos-carousel-container">
				<ul ref="v" className={'videos-carousel ' + animate} style={style}
				 	onTouchStart={this.onTouchStart}
					onTouchMove={this.onTouchMove}
					onTouchEnd={this.onTouchEnd}
					tabIndex="0">
					{this._renderItems(this.getVideoList(), {tag: 'li', activeIndex: this.state.active})}
				</ul>
				<button className="prev fi-arrow-left" onClick={this.onPrev} title="Prevous Video"/>
				<button className="next fi-arrow-right" onClick={this.onNext} title="Next Video"/>
				<ul className="videos-carousel-dots">
					{this._renderDots()}
				</ul>
			</div>
		);
	},


	_renderDots () {
		return this.getVideoList().map((_, i) => {
			var active = (i === (this.state.active || 0)) ? 'active' : null;
			return (<li key={'video-'+i}><a className={active} href={"#"+i}
				onClick={this.onActivateSlide} data-index={i}/></li>);
		});
	}
});
