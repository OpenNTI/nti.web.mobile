/* See: https://github.com/mozilla/vtt.js#usage */
import {
	WebVTT,
	VTTCue/*, VTTRegion*/
} from 'vtt.js';

import React from 'react';

import {getModel} from 'nti.lib.interfaces';
import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import {toAnalyticsPath} from 'analytics/utils';

import Discussions from 'content/components/discussions';
import Gutter from 'content/components/Gutter';

import DarkMode from 'common/components/DarkMode';
import Error from 'common/components/Error';
import Loading from 'common/components/Loading';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import {Component as Video} from 'video';

import Transcript from './Transcript';

import {NOT_FOUND, RETRY_AFTER_DOM_SETTLES} from 'content/components/annotations/Annotation';

const WatchVideoEvent = getModel('analytics.watchvideoevent');

const None = void 0;


class Annotation {
	constructor (item, root) {
		Object.assign(this, {item, root});
	}

	get id () { return this.item.getID(); }

	resolveVerticalLocation () {
		let getStart = x => x && x.getStart && x.getStart().getSeconds().toFixed(3);

		let {root, item} = this;
		let {applicableRange} = item;
		let start = getStart(applicableRange);

		root = root.refs.transcript;

		if (!root) {
			return RETRY_AFTER_DOM_SETTLES;
		} else if (!root.isMounted()) {
			return NOT_FOUND;
		}


		root = React.findDOMNode(root);
		let {scrollTop} = document.body;

		let cue = start && root.querySelector(`[data-start-time="${start}"]`);

		//getBoundingClientRect is effected by scroll position... so add it back in.
		return (cue ? cue : root).getBoundingClientRect().top + scrollTop;
	}
}


export default React.createClass({
	displayName: 'TranscriptedVideo',
	mixins: [ContextSender, NavigatableMixin],

	propTypes: {
		VideoIndex: React.PropTypes.object.isRequired,
		outlineId: React.PropTypes.string,
		videoId: React.PropTypes.string,
		course: React.PropTypes.object,

		showDiscussions: React.PropTypes.bool
	},

	getInitialState () {
		return {
			loading: true,
			error: false,
			cues: None,
			regions: None,
			currentTime: 0
		};
	},


	componentDidMount () {
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount () {
		this.loadDiscussions(None);
	},


	componentWillReceiveProps (props) {
		let {showDiscussions, videoId} = this.props;

		if (props.videoId !== videoId) {
			this.getDataIfNeeded(props);
		}
	},


	componentDidUpdate (prevProps) {
		let {outlineId, VideoIndex, showDiscussions} = this.props;
		let {video, currentTime} = this.state;

		let pageSource = video && VideoIndex.getPageSource(video);

		if (outlineId && pageSource) {
			pageSource = pageSource.scoped(decodeFromURI(outlineId));
		}

		if (video) {
			this.setPageSource(pageSource, video.getID());
		}

		if (!showDiscussions && prevProps.showDiscussions && currentTime) {
			this.setState({returnTime: currentTime}); //eslint-disable-line react/no-did-update-set-state
		}
	},


	onError (error) {
		this.setState({
			loading: false,
			error: error,
			data: None
		});
	},


	getContext () {
		let {videoId} = this.props;
		return Promise.resolve({
			label: 'Video',
			href: this.makeHref(videoId + '/')
		});
	},


	getDataIfNeeded (props) {
		this.setState(this.getInitialState());

		try {

			let {VideoIndex, videoId} = props;
			let video = VideoIndex.get(decodeFromURI(videoId));

			this.resolveContext()
				.then(context => this.setState({ context }));

			let transcript = this.loadTranscript(video);
			let notes = this.loadDiscussions(video);

			Promise.all([ notes, transcript ])
				.then(this.setState({loading: false}))
				.catch(this.onError);

		} catch (e) {
			this.onError(e);
		}
	},


	loadDiscussions (video) {
		let {store} = this.state;

		if (store) {
			store.removeListener('change', this.onStoreChanged);
		}

		return video && video.getUserData()
			.then(x => x.waitForPending().then(()=>x))
			.then(x => {
				x.addListener('change', this.onStoreChanged);
				this.setState({
						store: x,
						storeProvider: {getUserDataStore: ()=>x}
					},
					()=> this.onStoreChanged(x));
			});
	},


	loadTranscript (video) {
		return video.getTranscript('en')
			.then(vtt => {
				let parser = new WebVTT.Parser(global, WebVTT.StringDecoder()),
					cues = [], regions = [];

				parser.oncue = cue=> cues.push(cue);
				parser.onregion = region=> regions.push(region);
				parser.onparsingerror = e=> { throw e; };

				if (!global.VTTCue) {
					global.VTTCue = VTTCue;
				}

				parser.parse(vtt);
				parser.flush();

				if (global.VTTCue === VTTCue) {
					delete global.VTTCue;
				}

				this.setState({
					cues,
					regions,
					video
				});

			})
			.catch(reason=> {
				if (reason === video.NO_TRANSCRIPT ||
					reason === video.NO_TRANSCRIPT_LANG) {
					this.setState({ cues: None, regions: None, video });
					return;
				}
				return Promise.reject(reason);

			});
	},


	onNewWatchEventFactory (e) {
		let {context, cues, regions, video} = this.state;
		let {course} = this.props;

		let courseId = course.getID();

		return new WatchVideoEvent(
			video.ntiid,
			courseId,
			toAnalyticsPath(context || []),
			e.currentTime,
			e.duration,
			Boolean(cues || regions)
		);
	},


	onStoreChanged (store) {
		if (this.state.store !== store) {
			return;
		}

		let annotations = {};

		for (let item of store) {
			annotations[item.getID()] = new Annotation(item, this);
		}

		this.setState({annotations});
	},


	onVideoTimeTick (event) {
		let time = (event.target || {}).currentTime;
		let {returnTime} = this.state;

		if (this.isMounted()) {
			if (returnTime != null) {
				this.onJumpTo(returnTime);
				returnTime = null;
			}

			this.setState({currentTime: time, returnTime});
		}
	},


	onJumpTo  (time) {
		this.refs.video.setCurrentTime(parseFloat(time));
	},


	setDiscussionFilter (selectedDiscussions) {
		this.setState({selectedDiscussions});
	},


	render () {
		let {showDiscussions, videoId} = this.props;
		let {annotations, storeProvider, selectedDiscussions, error, video, cues, regions, currentTime, loading} = this.state;

		loading = loading || !video;

		if (error && !video) {
			return ( <Error error={error}/> );
		}

		if (loading) {
			return ( <Loading /> );
		}

		if (showDiscussions) {
			return ( <Discussions UserDataStoreProvider={storeProvider} filter={selectedDiscussions}/> );
		}

		return (
			<div className="transcripted-video">
				<DarkMode/>
				{!video ? None : (
				<Video ref="video"
						src={video}
						onTimeUpdate={this.onVideoTimeTick}
						newWatchEventFactory={this.onNewWatchEventFactory}
						autoPlay/>
				)}
				<div className="transcript">
					{error ? (
						<div>
							Transcript not available
						</div>
					) : (
						<Transcript ref="transcript"
							onJumpTo={this.onJumpTo}
							currentTime={currentTime}
							regions={regions}
							cues={cues}/>
					)}
					<Gutter items={annotations} selectFilter={this.setDiscussionFilter} prefix={videoId}/>
				</div>

			</div>
		);
	}
});
