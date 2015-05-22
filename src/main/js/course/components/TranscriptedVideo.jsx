/* See: https://github.com/mozilla/vtt.js#usage */
import {
	WebVTT,
	VTTCue/*, VTTRegion*/
} from 'vtt.js';

import React from 'react';
import CSS from 'react/lib/CSSCore';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import Error from 'common/components/Error';
import LoadingMask from 'common/components/Loading';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import {Component as Video} from 'video';

import Transcript from './Transcript';


export default React.createClass({
	displayName: 'TranscriptedVideo',
	mixins: [ContextSender, NavigatableMixin],

	propTypes: {
		videoId: React.PropTypes.string,
		course: React.PropTypes.object
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
		CSS.addClass(document.body, 'dark');
	},


	componentWillUnmount () {
		CSS.removeClass(document.body, 'dark');
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

			video.getTranscript('en')
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
						loading: false,
						cues,
						regions,
						video
					});

				})
				.catch(reason=> {
					if (reason === video.NO_TRANSCRIPT ||
						reason === video.NO_TRANSCRIPT_LANG) {
						this.setState({
							loading: false, cues: null, regions: null, video });
						return;
					}
					return Promise.reject(reason);

				})

				.catch(this.onError);

		} catch (e) {
			this.onError(e);
		}
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


	render () {
		let {error, video, cues, regions, currentTime, loading} = this.state;


		loading = loading || !video;

		if (error && !video) {
			return ( <Error error={error}/> );
		}

		return (
			<div className="transcripted-video">
				<LoadingMask loading={loading}>
					{!video ? null : (
					<Video ref="video"
							courseId={this.props.course.getID()}
							src={video}
							onTimeUpdate={this.onVideoTimeTick}
							context={this.state.context}
							transcript={true}
							autoPlay/>
					)}
					<div className="transcript">
						{
							error ?
								<div>Transcript not available</div> :
								<Transcript ref="transcript"
									onJumpTo={this.onJumpTo}
									currentTime={currentTime}
									regions={regions}
									cues={cues}
								/>
						}
					</div>
				</LoadingMask>
			</div>
		);
	}
});
