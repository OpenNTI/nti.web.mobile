import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Progress} from 'nti-lib-interfaces';
import {getScreenHeight, getScrollParent} from 'nti-lib-dom';
import {Loading} from 'nti-web-commons';
import {Component as Video} from 'nti-web-video';

import ContextAccessor from 'common/mixins/ContextAccessor';

import Mixin from './Mixin';


function getVideo (object, index) {
	const {NTIID = object.ntiid} = object;

	if (object.getID) {
		return object;
	}

	return NTIID ? index.get(NTIID) : index.mediaFrom(object);
}


function listen (context, action) {
	const p = getScrollParent(context.el);
	p[action]('scroll', context.maybeRenderVideo, false);
	if (p !== global) {
		global[action]('scroll', context.maybeRenderVideo, false);
	}
}


const inView = y => y >= 0 && y <= getScreenHeight();


export default createReactClass({
	displayName: 'NTIVideo',
	mixins: [Mixin, ContextAccessor],

	statics: {
		interactiveInContext: true,
		itemType: /ntivideo$/i
	},

	propTypes: {
		item: PropTypes.object,

		contentPackage: PropTypes.object,

		onFocus: PropTypes.func,

		tag: PropTypes.any
	},


	attachRef (x) { this.el = x; },
	attachVideoRef (x) { this.video = x; },


	getInitialState () {
		return { loading: false, error: false, video: false };
	},


	onError (error) {
		this.setState({
			loading: false,
			playing: false,
			video: null,
			error
		});
	},


	componentDidMount () {
		this.fillInVideo(this.props);
		listen(this, 'addEventListener');
		this.maybeRenderVideo();
	},


	componentWillUnmount () {
		listen(this, 'removeEventListener');
	},


	componentWillReceiveProps (nextProps) {
		this.fillInVideo(nextProps);
		this.setState({playing: false});
	},


	getVideoID (props) {
		const item = (props || this.props).item;

		return item.NTIID || (item.dataset || {}).ntiid;
	},


	fillInVideo  (props) {
		try {
			const {state: {video}} = this;
			const {contentPackage, item} = props;

			if (video && item.NTIID === video.getID()) {
				return;
			}

			this.setState({loading: true});


			this.resolveContext()
				.then(context=>this.setState({context}))

				.then(() => getVideo(item))
				.catch(() => contentPackage && contentPackage.getVideoIndex()
					.catch(() => null)
					.then(index => getVideo(item, index)))

				.then(v => {
					v.getPoster()
						.then(poster=>
							this.setState({
								video: v,
								loading: false,
								poster
							}));
				})
				.catch(this.onError);
		} catch (e) {
			this.onError(e);
		}
	},


	onPosterClicked (e) {
		e.stopPropagation();
		this.onPlayClicked(e);
	},


	onPlayClicked (e) {
		e.preventDefault();
		e.stopPropagation();

		this.setState({requestPlay: true}, () => {

			const {video} = this;
			if (video) {
				video.play();
			}

		});
	},


	stop () {
		const {video} = this;
		if (video) {
			video.stop();
		}
	},


	onStop () {
		if (this.video) {
			this.setState({playing: false});
		}
	},


	onPlay  () {
		if (this.video) {
			this.setState({playing: true});
		}
	},


	maybeRenderVideo () {
		const {el, state: {requestPlay}} = this;
		if (!el || requestPlay) { return; }

		const {top, bottom} = el.getBoundingClientRect();

		if ([top, bottom].some(inView)) {
			this.setState({requestPlay: true});
		}
	},


	render () {
		const {
			props: {item, tag = 'div', onFocus},
			state: {loading, playing, poster, video, requestPlay}
		} = this;

		const label = item.label || item.title;

		const Tag = tag || 'div';

		const progress = item[Progress];
		const viewed = (progress && progress.hasProgress());

		const posterRule = poster && {backgroundImage: `url(${poster})`};

		return (
			<Tag ref={this.attachRef} className="content-video video-wrap flex-video widescreen" data-ntiid={this.getVideoID()}>
				{!video || !requestPlay ? null :
					<Video ref={this.attachVideoRef} src={video}
						onEnded={this.onStop}
						onPaused={this.onStop}
						onPlaying={this.onPlay}
						context={this.state.context}
					/>
				}

				{(playing || requestPlay) ? null :
					<Loading.Mask style={posterRule} loading={loading}
						tag="a" onFocus={onFocus} onClick={this.onPosterClicked}
						className="content-video-tap-area" href="#">

						{viewed && <div className="viewed">Viewed</div>}

						<div className="wrapper">
							<div className="buttons">
								<span className="play" title="Play" onClick={this.onPlayClicked}/>
								<span className="label" title={label}>{label}</span>
							</div>
						</div>
					</Loading.Mask>
				}
			</Tag>
		);
	}
});
