import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {getService} from '@nti/web-client';
import {Progress} from '@nti/lib-interfaces';
import {getScreenHeight, getScrollParent} from '@nti/lib-dom';
import {Loading} from '@nti/web-commons';
import {Component as Video} from '@nti/web-video';
import {scoped} from '@nti/lib-locale';

import ContextAccessor from 'common/mixins/ContextAccessor';

import Mixin from './Mixin';

const REF_CLASS = 'ntivideoref';

const DEFAULT_TEXT = {
	error: 'Video not found.'
};

const t = scoped('content.widgets.video', DEFAULT_TEXT);


function getVideo (object, index) {
	const {NTIID = object.ntiid} = object;

	if (object.getID) {
		return object;
	}

	return NTIID ? index.get(NTIID) : index.mediaFrom(object);
}


async function getVideoRef (object) {
	const service = await getService();

	return service.getObject(object.NTIID || object.ntiid);
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
		itemType: /ntivideo(ref)?$/i
	},

	propTypes: {
		item: PropTypes.object,

		contentPackage: PropTypes.object,
		onContentReady: PropTypes.func,

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


	componentDidUpdate (prevProps) {
		const {contentPackage, item} = this.props;

		if (item !== prevProps.item || contentPackage !== prevProps.contentPackage) {
			this.fillInVideo(this.props);
			this.setState({playing: false});
		}
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

			if (item.Class === REF_CLASS) { return this.fillInVideoRef(props); }

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
							}, () => this.maybeUpdateReaderContent()));
				})
				.catch(this.onError);
		} catch (e) {
			this.onError(e);
		}
	},


	fillInVideoRef (props) {
		const {item} = props;

		this.resolveContext()
			.then(context => this.setState({context}))
			.then(() => getVideoRef(item))
			.then((v) => {
				v.getPoster()
					.then(poster => {
						this.setState({
							video: v,
							loading: false,
							poster
						}, () => this.maybeUpdateReaderContent());
					});
			})
			.catch(this.onError);
	},


	maybeUpdateReaderContent () {
		const {onContentReady} = this.props;

		if (onContentReady) {
			onContentReady();
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
			state: {loading, playing, poster, video, requestPlay, error}
		} = this;

		const label = item.label || item.title || (video && video.title);

		const Tag = tag || 'div';

		const progress = item[Progress];
		const viewed = (progress && progress.hasProgress());

		const posterRule = poster && {backgroundImage: `url(${poster})`};

		return (
			<Tag ref={this.attachRef} className="content-video video-wrap" data-ntiid={this.getVideoID()}>
				{error && (
					<div className="error">
						<span>{t('error')}</span>
					</div>
				)}

				{!video || !requestPlay || error ? null : (
					<Video ref={this.attachVideoRef} src={video}
						onEnded={this.onStop}
						onPause={this.onStop}
						onPlaying={this.onPlay}
						analyticsData={{
							resourceId: this.getVideoID(),
							context: this.state.context
						}}
					/>
				)}

				{(playing || requestPlay || error) ? null : (
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
				)}
			</Tag>
		);
	}
});
