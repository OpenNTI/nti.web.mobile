import path from 'path';
import React from 'react/addons';

import LoadingMask from 'common/components/Loading';
import BasePathAware from 'common/mixins/BasePath';

import {Component as Video} from 'video';
import {encodeForURI} from 'dataserverinterface/utils/ntiids';

export default React.createClass({
	displayName: 'CourseOverviewVideo',
	mixins: [BasePathAware],

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
		this.props.contextProvider(this.props)
			.then(context=> this.setState({context}));
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
		this.getContext();
		this.fillInVideo(this.props);
	},


	componentWillReceiveProps (nextProps) {
		this.getContext();
		this.fillInVideo(nextProps);

		if (this.props.activeIndex !== nextProps.activeIndex) {
			this.setState({playing: false});
		}
	},


	fillInVideo  (props) {
		try {
			var {video} = this.state;
			var {course, item} = props;

			if (video && item.NTIID === video.getID()) {
				return;
			}

			this.setState({loading: true});
			course.getVideoIndex()
				.then(videoIndex =>
					this.setState({
						loading: false,
						video: videoIndex.get(item.NTIID)
					})
				)
				.catch(this.onError);
		} catch (e) {
			this.onError(e);
		}
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
		var {activeIndex, index, item} = props;
		var renderVideoFully = true;

		var Tag = props.tag || 'div';
		var style = {
			backgroundImage: 'url(' + item.poster + ')'
		};

		if (activeIndex != null) {
			renderVideoFully = (activeIndex === index);
		}

		var link = path.join(this.getBasePath(),
			'course', encodeForURI(props.course.getID()),
			'v', encodeForURI(item.NTIID))  + '/';

		return (
			<Tag className="overview-video video-wrap flex-video widescreen">
				{!this.state.video || !renderVideoFully ? null :
					<Video ref="video" src={this.state.video}
						onEnded={this.onStop}
						onPlaying={this.onPlay}
						context={this.state.context} />
				}
				{this.state.playing ? null :
				<LoadingMask style={style} loading={this.state.loading}
					tag="a" onFocus={props.onFocus}
					className="overview-tap-area" href={link}>

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
