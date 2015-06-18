import React from 'react';

import LoadingMask from 'common/components/Loading';

import ContextAccessor from 'common/mixins/ContextAccessor';

import {Component as Video} from 'video';

import Mixin from './Mixin';

const Progress = Symbol.for('Progress');

export default React.createClass({
	displayName: 'NTIVideo',
	mixins: [Mixin, ContextAccessor],

	statics: {
		interactiveInContext: true,
		itemType: /ntivideo$/i
	},

	propTypes: {
		item: React.PropTypes.object,

		contentPackage: React.PropTypes.object
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


	getVideoID(props) {
		let item = (props || this.props).item;

		return item.NTIID || (item.dataset || {}).ntiid;
	},


	fillInVideo  (props) {
		try {
			let {video} = this.state;
			let {contentPackage, item} = props;

			if (video && item.NTIID === video.getID()) {
				return;
			}

			let NTIID = this.getVideoID();

			this.setState({loading: true});


			this.resolveContext()
				.then(context=>this.setState({context}))

				.then(()=> (typeof item.getPoster === 'function')
						? item
						: contentPackage.getVideoIndex().then(x=> x.get(NTIID)))

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

		let {video} = this.refs;
		if (video) {
			video.play();
		}
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
		let {props} = this;
		let {item} = props;
		let {loading, playing, poster, video} = this.state;

		let label = item.label || item.title;

		let Tag = props.tag || 'div';

		let viewed = false;
		let progress = item[Progress];
		if (progress && progress.hasProgress()) {
			viewed = true;
		}

		poster = poster && {backgroundImage: `url(${poster})`};

		return (
			<Tag className="content-video video-wrap flex-video widescreen">
				{!video ? null :
					<Video ref="video" src={video}
						onEnded={this.onStop}
						onPlaying={this.onPlay}
						context={this.state.context}
						deferred />
				}

				{playing ? null :
					<LoadingMask style={poster} loading={loading}
						tag="a" onFocus={props.onFocus} onClick={this.onPosterClicked}
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
