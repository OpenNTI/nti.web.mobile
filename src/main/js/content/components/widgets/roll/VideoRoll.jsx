import React from 'react';

import cx from 'classnames';

import Error from 'common/components/Error';
import Loading from 'common/components/Loading';

import ContextAccessor from 'common/mixins/ContextAccessor';

import {Component as Video} from 'video';

import Mixin from '../Mixin';
import RollCommon from './Mixin';


function getVideo (object, index) {
	let {NTIID = object.ntiid} = object;

	if (object.getID) {
		return object;
	}

	return NTIID ? index.get(NTIID) : index.videoFrom(object);
}


export default React.createClass({
	displayName: 'VideoRoll',
	mixins: [Mixin, RollCommon, ContextAccessor],

	statics: {
		itemType: 'videoroll'
	},

	propTypes: {
		item: React.PropTypes.object
	},


	getItemCount () { return this.getVideos().length; },


	getVideos () {
		let {videos} = this.state || {};
		return videos || [];
	},


	getPosters () {
		let {posters} = this.state || {};
		return posters || [];
	},


	getVideo (index) {
		return this.getVideos()[index];
	},


	getPoster (index) {
		return this.getPosters()[index];
	},


	getCurrentVideo () {
		return this.getVideo(this.getActiveIndex());
	},


	getCurrentPoster () {
		return this.getPoster(this.getActiveIndex());
	},


	getNextPoster () {
		return this.getPoster(this.getActiveIndex() + 1);
	},


	getPrevPoster () {
		return this.getPoster(this.getActiveIndex() - 1);
	},


	componentDidMount () {
		this.fillInValues(this.props);
	},


	componentWillReceiveProps (nextProps) {
		this.fillInVideo(nextProps);
	},


	componentWillUpdate (_, state) {
		if (this.state.current !== state.current) {
			this.setState({playing: false});
		}
	},


	fillInValues (props) {
		let {contentPackage, item} = props;

		this.setState({loading: true});


		this.resolveContext()
			.then(context => this.setState({context}))

			.then(() => item.videos.map(v=> getVideo(v)))
			.catch(() => contentPackage && contentPackage.getVideoIndex()
				.catch(() => null)
				.then(index => item.videos.map(v=> getVideo(v, index))))

			.then(videos => Promise.all(videos.map(v => v.getPoster()))
					.then(posters=> ({videos, posters})))

			.then(data => this.setState({
				loading: false,
				videos: data.videos,
				posters: data.posters
			}))

			.catch(this.onError);
	},


	onError (e) {
		console.error(e.stack || e.message || e);
		this.setState({
			loading: false,
			error: e
		});
	},


	onStop () {
		this.setState({playing: false});
	},


	onPlay () {
		this.setState({playing: true});
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
			this.setState({playing: true});
		}
	},


	stop () {
		let {video} = this.refs;
		if (video) {
			video.stop();
		}
	},


	getVideoStyle (poster) {
		return poster && { backgroundImage: `url(${poster})` };
	},


	getCurrentItemStyle () {
		return this.getVideoStyle(this.getCurrentPoster());
	},


	getNextItemStyle () {
		return this.getVideoStyle(this.getNextPoster());
	},


	getPreviousItemStyle () {
		return this.getVideoStyle(this.getPrevPoster());
	},


	render () {
		let count = this.getItemCount();
		let {item} = this.props;
		let {loading, error, playing} = this.state;

		let {title} = item;

		let empty = loading || error || count === 0;

		let stageClasses = cx('stage', {});

		let next = this.getNextItemStyle();
		let prev = this.getPreviousItemStyle();
		let style = this.getCurrentItemStyle();

		let video = this.getCurrentVideo();

		return (
			<div className="media-roll video-roll">
				<label>{title}</label>
				<div ref="stage" className={stageClasses}>

					{ loading ? (

						<Loading/>

					) : error ? (

						<Error error={error}/>

					) : empty ? (

						<div className="item video" style={style} data-empty-message="No Videos"/>

					) : (

						<div ref="current" className="item video current content-video" style={style}>

							{!video ? null :
								<Video ref="video" src={video}
									onEnded={this.onStop}
									onPlaying={this.onPlay}
									context={this.state.context}
									/>
							}

							{playing ? null :
								<a style={style} onClick={this.onPosterClicked} className="content-video-tap-area" href="#">
									<div className="wrapper">
										<div className="buttons">
											<span className="play" title="Play" onClick={this.onPlayClicked}/>
										</div>
									</div>
								</a>
							}

							{prev && ( <button className="prev" onClick={this.onPrev} alt="previous"/> )}
							{next && ( <button className="next" onClick={this.onNext} alt="next"/> )}
						</div>

					)}

					{prev && ( <div className="item video prev" style={prev} /> )}
					{next && ( <div className="item video next" style={next} /> )}

				</div>
				{this.renderList()}
			</div>
		);
	},


	renderList () {
		let videos = this.getVideos();
		return videos.length > 1 ?
			React.createElement('ul', {ref: 'list'},
				...videos.map((i, x)=>this.renderThumbnail(i, x))) :
				null;
	},


	renderThumbnail (video, index) {
		let {posters = []} = this.state;
		let thumb = posters[index];

		let active = index === this.getActiveIndex();

		thumb = thumb && { backgroundImage: `url(${thumb})` };

		return (
			<li className={cx('thumbnail video', {active})}
				ref={'thumbnail' + index}
				data-index={index}
				style={thumb}>
				<a href="#" onClick={this.onThumbnailClick} title="thumbnail"><div className="icon fi-play-circle"/></a>
			</li>
		);
	}
});
