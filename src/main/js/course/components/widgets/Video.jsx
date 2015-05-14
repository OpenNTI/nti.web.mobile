import path from 'path';
import React from 'react';

import LoadingMask from 'common/components/Loading';
import Err from 'common/components/Error';
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
		course: React.PropTypes.object.isRequired,

		activeIndex: React.PropTypes.number,
		index: React.PropTypes.number,
		touching: React.PropTypes.bool,
		tag: React.PropTypes.string,
		onFocus: React.PropTypes.func
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
		if (this.getID() !== this.getID(nextProps)) {
			this.fillInContext();
			this.fillInVideo(nextProps);
		}

		if (this.props.activeIndex !== nextProps.activeIndex) {
			this.setState({playing: false});
		}
	},


	getID (props= this.props) {
		let {NTIID, ntiid} = props.item;
		return NTIID || ntiid;
	},


	fillInVideo  (props) {
		try {
			let {video} = this.state;
			let {course} = props;
			let id = this.getID();

			if (video && id === video.getID()) {
				return;
			}

			this.setState({loading: true});
			//The "item" is now going to be a full Video object, we no longer have to look it up.
			//TODO: Simply Parse/Present the video w/o looking it up in the VideoIndex

			course.getVideoIndex()
				.then(videoIndex => {
					let v = videoIndex.get(id);
					return v.getPoster()
						.then(poster=> {
							this.setState({loading: false, poster, video: v});
						});
				})
				.catch(this.onError);
		} catch (e) {
			this.onError(e);
		}
	},


	onPlayClicked (/*e*/) {
		/*let {video} = this.refs;
		if (video) {
			e.preventDefault();
			e.stopPropagation();
			video.play();
		}*/
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
		let {
			activeIndex,
			index,
			touching,
			item,
			tag = 'div',
			onFocus
		} = this.props;

		let {video, poster, playing, error} = this.state;
		let renderVideoFully = !touching;

		let style = poster && { backgroundImage: 'url(' + poster + ')' };

		if (activeIndex != null) {
			renderVideoFully = (!touching && activeIndex === index);
		}


		let viewed = false;
		let progress = item[Progress];
		if (progress && progress.hasProgress()) {
			viewed = true;
		}

		let link = path.join('v', encodeForURI(this.getID())) + '/';

		let Tag = tag;

		if (error) {
			playing = true;
			video = false;
		}

		return (
			<Tag className="overview-video video-wrap flex-video widescreen">
				{error && (
					<Err error={error}/>
				)}
				{(!video || !renderVideoFully) ? null :
					<Video ref="video" src={this.state.video}
						onEnded={this.onStop}
						onPlaying={this.onPlay}
						context={this.state.context}
						deferred />
				}
				{playing ? null :
				<LoadingMask style={style} loading={this.state.loading}
					tag="a" onFocus={onFocus}
					className="overview-tap-area" href={link}>
					{viewed && <div className="viewed">Viewed</div>}
					<div className="wrapper">
						<div className="buttons">
							<span className="play" title="Play" onClick={this.onPlayClicked}/>
							<span className="label" title={item.title}>{item.title}</span>
						</div>
					</div>
				</LoadingMask>
				}
			</Tag>
		);
	}
});
