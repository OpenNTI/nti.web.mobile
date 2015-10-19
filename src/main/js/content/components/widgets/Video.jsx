import React from 'react';

import {CommonSymbols} from 'nti.lib.interfaces';
let {Progress} = CommonSymbols;

import LoadingMask from 'common/components/Loading';

import ContextAccessor from 'common/mixins/ContextAccessor';

import {Component as Video} from 'video';

import Mixin from './Mixin';


function getVideo (object, index) {
	let {NTIID = object.ntiid} = object;

	if (object.getID) {
		return object;
	}

	return NTIID ? index.get(NTIID) : index.videoFrom(object);
}


export default React.createClass({
	displayName: 'NTIVideo',
	mixins: [Mixin, ContextAccessor],

	statics: {
		interactiveInContext: true,
		itemType: /ntivideo$/i
	},

	propTypes: {
		item: React.PropTypes.object,

		contentPackage: React.PropTypes.object,

		onFocus: React.PropTypes.func,

		tag: React.PropTypes.any
	},




	getInitialState () {
		return { loading: false, error: false, video: false };
	},


	onError (error) {
		if (this.isMounted()) {
			this.setState({
				loading: false,
				playing: false,
				video: null,
				error
			});
		}
	},


	componentDidMount () {
		this.fillInVideo(this.props);
	},


	componentWillReceiveProps (nextProps) {
		this.fillInVideo(nextProps);
		this.setState({playing: false});
	},


	getVideoID (props) {
		let item = (props || this.props).item;

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

			let {refs: {video}} = this;
			if (video) {
				video.play();
			}

		});
	},


	stop () {
		let {video} = this.refs;
		if (video) {
			video.stop();
		}
	},


	onStop () {
		if (this.isMounted()) {
			this.setState({playing: false});
		}
	},


	onPlay  () {
		if (this.isMounted()) {
			this.setState({playing: true});
		}
	},


	render () {
		const {
			props: {item, tag = 'div', onFocus},
			state: {loading, playing, poster, video, requestPlay}
		} = this;

		let label = item.label || item.title;

		let Tag = tag || 'div';

		let viewed = false;
		let progress = item[Progress];
		if (progress && progress.hasProgress()) {
			viewed = true;
		}

		let posterRule = poster && {backgroundImage: `url(${poster})`};

		return (
			<Tag className="content-video video-wrap flex-video widescreen" data-ntiid={this.getVideoID()}>
				{!video || !requestPlay ? null :
					<Video ref="video" src={video}
						onEnded={this.onStop}
						onPlaying={this.onPlay}
						context={this.state.context}
						autoPlay={requestPlay}
						deferred />
				}

				{requestPlay || playing ? null :
					<LoadingMask style={posterRule} loading={loading}
						tag="a" onFocus={onFocus} onClick={this.onPosterClicked}
						className="content-video-tap-area" href="#">

						{viewed && <div className="viewed">Viewed</div>}

						<div className="wrapper">
							<div className="buttons">
								<span className="play" title="Play" onClick={this.onPlayClicked}/>
								<span className="label" title={label}>{label}</span>
							</div>
						</div>
					</LoadingMask>
				}
			</Tag>
		);
	}//controls autobuffer autoplay loop
});
