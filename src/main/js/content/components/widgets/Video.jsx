import path from 'path';
import React from 'react';

import LoadingMask from 'common/components/Loading';
import BasePathAware from 'common/mixins/BasePath';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import {Component as Video} from 'video';
import {encodeForURI} from 'dataserverinterface/utils/ntiids';

const Progress = Symbol.for('Progress');

export default React.createClass({
	displayName: 'NTIVideo',
	mixins: [BasePathAware, NavigatableMixin],


	propTypes: {
		item: React.PropTypes.object.isRequired,
		contentPackage: React.PropTypes.object.isRequired,
		contextProvider: React.PropTypes.func.isRequired
	},


	statics: {
		mimeType: /ntivideo$/i,

		handles (item) {
			let re = this.mimeType;
			return re.test(item.type) || re.test(item.class);
		}
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

		if (this.props.activeIndex !== nextProps.activeIndex) {
			this.setState({playing: false});
		}
	},


	getVideoID(props) {
		let item = (props || this.props).item;

		return item.NTIID || (item.dataset || {}).ntiid;
	},


	fillInVideo  (props) {
		try {
			var {video} = this.state;
			var {contentPackage, item, contextProvider} = props;

			if (video && item.NTIID === video.getID()) {
				return;
			}

			var NTIID = this.getVideoID();

			this.setState({loading: true});

			if (!contextProvider) {
				contextProvider = Promise.resolve.bind(Promise, null);
			}

			contextProvider(props)
				.then(context=>
					this.isMounted() && this.setState({context}))
				.then(()=>
					contentPackage.getVideoIndex().then(videoIndex => {
							let video = videoIndex.get(NTIID);
							this.setState({ loading: false, video });
							video.getPoster().then(poster=>
								this.isMounted() &&
									this.setState({poster}));
						})
				)
				.catch(this.onError);
		} catch (e) {
			this.onError(e);
		}
	},


	onPosterClicked (e) {
		e.stopPropagation();
	},


	onPlayClicked (e) {
		e.preventDefault();
		e.stopPropagation();

		var {video} = this.refs;
		if (video) {
			video.play();
		}
	},


	stop () {
		var {video} = this.refs;
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
		var {props} = this;
		var {item} = props;

		var label = item.label || item.title;

		var Tag = props.tag || 'div';

		var viewed = false;
		var progress = item[Progress];
		if (progress && progress.hasProgress()) {
			viewed = true;
		}

		var link = path.join('v', encodeForURI(this.getVideoID()))  + '/';

		link = this.makeParentRouterHref(link);

		return (
			<Tag className="content-video video-wrap flex-video widescreen">
				{!this.state.video ? null :
					<Video ref="video" src={this.state.video}
						onEnded={this.onStop}
						onPlaying={this.onPlay}
						context={this.state.context} />
				}

				{this.state.playing ? null :
					<LoadingMask style={{backgroundImage: `url(${this.state.poster})`}} loading={this.state.loading}
						tag="a" onFocus={props.onFocus} onClick={this.onPosterClicked}
						className="content-video-tap-area" href={link}>

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
