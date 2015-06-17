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

const WatchVideoEvent = getModel('analytics.watchvideoevent');


class Annotation {
	constructor (item, root) {
		Object.assign(this, {item, root});
	}

	get id () { return this.item.getID(); }

	resolveVerticalLocation () {
		let {root, item} = this;
		let {applicableRange} = item;
		let start = applicableRange.getStart().getSeconds().toFixed(3);

		root = root.refs.transcript;

		if (!root.isMounted()) {
			return -1;
		}


		root = React.findDOMNode(root);

		let cue = root.querySelector(`[data-start-time="${start}"]`);

		return (cue ? cue : root).getBoundingClientRect().top;
	}
}


export default React.createClass({
	displayName: 'TranscriptedVideo',
	mixins: [ContextSender, NavigatableMixin],

	propTypes: {
		videoId: React.PropTypes.string,
		course: React.PropTypes.object,

		showDiscussions: React.PropTypes.bool
	},

	getInitialState () {
		return {
			loading: true,
			error: false,
			cues: null,
			regions: null,
			currentTime: 0
		};
	},


	componentDidMount () {
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount () {
		this.loadDiscussions(null);
	},


	componentWillReceiveProps (nextProps) {
		if (nextProps.videoId !== this.props.videoId) {
			this.getDataIfNeeded(nextProps);
		}
	},

	onError (error) {
		this.setState({
			loading: false,
			error: error,
			data: null
		});
	},


	getContext () {
		let {videoId} = this.props;
		return Promise.resolve({
			label: 'Video',
			href: this.makeHref(videoId)
		});
	},


	getDataIfNeeded (props) {
		this.setState(this.getInitialState());

		try {

			let {VideoIndex, videoId, outlineId} = props;
			let video = VideoIndex.get(decodeFromURI(videoId));

			let pageSource = video && video.getPageSource();

			if (outlineId && pageSource) {
				pageSource = pageSource.scoped(decodeFromURI(outlineId));
			}

			this.resolveContext()
				.then(context => this.setState({ context }));

			this.setPageSource(pageSource, video.getID());

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
					this.setState({ cues: null, regions: null, video });
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
		if (this.isMounted()) {
			this.setState({currentTime: time});
		}
	},


	onJumpTo  (time) {
		this.refs.video.setCurrentTime(parseFloat(time));
	},


	setDiscussionFilter (selectedDiscussions) {
		this.setState({selectedDiscussions});
	},


	render () {
		let {annotations, storeProvider, selectedDiscussions, error, video, cues, regions, currentTime, loading} = this.state;

		loading = loading || !video;

		if (error && !video) {
			return ( <Error error={error}/> );
		}

		if (loading) {
			return ( <Loading /> );
		}

		if (this.props.showDiscussions) {
			return ( <Discussions UserDataStoreProvider={storeProvider} filter={selectedDiscussions}/> );
		}

		return (
			<div className="transcripted-video">
				<DarkMode/>
				{!video ? null : (
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
					<Gutter items={annotations} selectFilter={this.setDiscussionFilter}/>
				</div>

			</div>
		);
	}
});
