import React from 'react';

import cx from 'classnames';

import getEventTarget from 'nti.lib.dom/lib/geteventtarget';

import Mixin from './Mixin';

const stop = e => { e.preventDefault(); e.stopPropagation(); };


function getVideo (object, index) {
	let {NTIID = object.ntiid} = object;

	return NTIID ? index.get(NTIID) : index.videoFrom(object);
}


export default React.createClass({
	displayName: 'VideoRoll',
	mixins: [Mixin],

	statics: {
		itemType: 'videoroll'
	},

	propTypes: {
		item: React.PropTypes.object
	},


	getInitialState () {
		return {
			current: 0
		};
	},


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


	getActiveIndex () {
		let {current = 0} = this.state;
		return current;
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


	fillInValues (props) {
		let {contentPackage, item, contextResolver} = props;

		this.setState({loading: true});

		if (!contextResolver) {
			contextResolver = ()=>Promise.resolve(null);
		}

		contextResolver(props)
			.then(context => this.setState({context}))

			.then(()=> contentPackage.getVideoIndex())

			.then(index => item.videos.map(v=> getVideo(v, index)))

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
	},


	onThumbnailClick (e) {
		stop(e);
		let attr = 'data-index';
		let index = getEventTarget(e, `[${attr}]`);
		if (index) {
			index = parseInt(index.getAttribute(attr), 10);
			this.setState({current: index});
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
		let {length} = this.getVideos();
		let {item} = this.props;

		let {title} = item;

		let empty = length === 0;

		let stageClasses = cx('stage', {});

		let next = this.getNextItemStyle();
		let prev = this.getPreviousItemStyle();
		let style = this.getCurrentItemStyle();


		return (
			<div className="media-roll video-roll">
				<label>{title}</label>
				<div ref="stage" className={stageClasses}>

					{empty ? (

						<div className="item video" style={style} data-empty-message="No Videos"/>

					) : (

						<div ref="current" className="item video current" style={style}>

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
		let thumb = this.state.posters[index];

		let active = index === this.getActiveIndex();

		thumb = thumb && { backgroundImage: `url(${thumb})` };

		return (
			<li className={cx('thumbnail video', {active})}
				ref={'thumbnail' + index}
				data-index={index}
				style={thumb}>
				<a href="#" onClick={this.onThumbnailClick} title="thumbnail"><div className="play fi-play-circle"/></a>
			</li>
		);
	}
});
