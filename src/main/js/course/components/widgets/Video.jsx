import path from 'path';
import React from 'react';

import LoadingMask from 'common/components/Loading';
import BasePathAware from 'common/mixins/BasePath';
import ContextAccessor from 'common/mixins/ContextAccessor';

import {Component as Video} from 'video';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

const Progress = Symbol.for('Progress');

export default React.createClass({
	displayName: 'CourseOverviewVideo',
	mixins: [BasePathAware, ContextAccessor],

	propTypes: {
		item: React.PropTypes.object.isRequired,
		course: React.PropTypes.object.isRequired
	},


	statics: {
		mimeTest: /^application\/vnd\.nextthought\.ntivideo$/i,
		handles (item) {
			return this.mimeTest.test(item.MimeType);
		}
	},


	getInitialState () {
		return {
			loading: false,
			error: false,
			video: false
		};
	},


	getContext () {
		return Promise.resolve([]);
	},


	fillInContext () {
		this.resolveContext().then(context=>this.setState({context}));
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
		this.fillInContext();
		this.fillInVideo(this.props);
	},


	componentWillReceiveProps (nextProps) {
		if (this.props.item.NTIID !== nextProps.item.NTIID) {
			this.fillInContext();
			this.fillInVideo(nextProps);
		}

		if (this.props.activeIndex !== nextProps.activeIndex) {
			this.setState({playing: false});
		}
	},


	fillInVideo  (props) {
		try {
			let {video} = this.state;
			let {course, item} = props;

			if (video && item.NTIID === video.getID()) {
				return;
			}

			this.setState({loading: true});
			course.getVideoIndex()
				.then(videoIndex => {
					let video = videoIndex.get(item.NTIID);
					this.setState({ loading: false, video });
					video.getPoster().then(poster=>
						this.setState({poster}));
				})
				.catch(this.onError);
		} catch (e) {
			this.onError(e);
		}
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
		this.setState({playing: false});
	},


	onPlay  () {
		this.setState({playing: true});
	},


	render () {
		let {props} = this;
		let {activeIndex, index, touching, item} = props;
		let renderVideoFully = !touching;

		let Tag = props.tag || 'div';
		let style = {
			backgroundImage: 'url(' + this.state.poster + ')'
		};

		if (activeIndex != null) {
			renderVideoFully = (!touching && activeIndex === index);
		}


		let viewed = false;
		let progress = item[Progress];
		if (progress && progress.hasProgress()) {
			viewed = true;
		}


		let link = path.join('v', encodeForURI(item.NTIID)) + '/';

		return (
			<Tag className="overview-video video-wrap flex-video widescreen">
				{!this.state.video || !renderVideoFully ? null :
					<Video ref="video" src={this.state.video}
						onEnded={this.onStop}
						onPlaying={this.onPlay}
						context={this.state.context}
						deferred />
				}
				{this.state.playing ? null :
				<LoadingMask style={style} loading={this.state.loading}
					tag="a" onFocus={props.onFocus}
					className="overview-tap-area" href={link}>
					{viewed && <div className="viewed">Viewed</div>}
					<div className="wrapper">
						<div className="buttons">
							<span className="play" title="Play" onClick={this.onPlayClicked}/>
							<span className="label" title={item.label}>{item.label}</span>
						</div>
					</div>
				</LoadingMask>
				}
			</Tag>
		);
	}//controls autobuffer autoplay loop
});
