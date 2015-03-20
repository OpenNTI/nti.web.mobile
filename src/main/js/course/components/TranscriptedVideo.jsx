/* See: https://github.com/mozilla/vtt.js#usage */
import {
	WebVTT,
	VTTCue/*, VTTRegion*/
} from "vtt.js";

import React from 'react';

import {decodeFromURI} from 'dataserverinterface/utils/ntiids';

import addClass from 'nti.dom/lib/addclass';
import removeClass from 'nti.dom/lib/removeclass';

import LoadingMask from 'common/components/Loading';

import ContextSender from 'common/mixins/ContextSender';
import SetStateSafely from 'common/mixins/SetStateSafely';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import {Component as Video} from 'video';

import Transcript from './Transcript';


export default React.createClass({
	displayName: 'TranscriptedVideo',
	mixins: [ContextSender, NavigatableMixin, SetStateSafely],


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
		addClass(document.body, 'dark');
	},


	componentWillUnmount () {
		removeClass(document.body, 'dark');
	},


	componentWillReceiveProps (nextProps) {
		if (nextProps.videoId !== this.props.videoId) {
			this.getDataIfNeeded(nextProps);
		}
	},

	__onError (error) {
		this.setStateSafely({
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
		this.setStateSafely(this.getInitialState());

		try {

			let {VideoIndex, videoId, outlineId} = props;
			let video = VideoIndex.get(decodeFromURI(videoId));

			let pageSource = video && video.getPageSource();

			if (outlineId && pageSource) {
				pageSource = pageSource.scopped(decodeFromURI(outlineId));
			}

			this.resolveContext()
				.then(context => this.setStateSafely({ context }));

			this.setPageSource(pageSource, video.getID());

			video.getTranscript('en')
				.then(vtt => {
					let parser = new WebVTT.Parser(global, WebVTT.StringDecoder()),
	        			cues = [], regions = [];

				    parser.oncue = cue=> cues.push(cue);
					parser.onregion = region=> regions.push(region);
					parser.onparsingerror = e=> {throw e;};

					if (!global.VTTCue) {
						global.VTTCue = VTTCue;
					}

				    parser.parse(vtt);
				    parser.flush();

					if (global.VTTCue === VTTCue) {
						delete global.VTTCue;
					}

					this.setStateSafely({
						loading: false,
						cues,
						regions,
						video
					});

				})
				.catch(reason=> {
					if (reason === video.NO_TRANSCRIPT ||
						reason === video.NO_TRANSCRIPT_LANG) {
						this.setStateSafely({
							loading: false, cues: null, regions: null });
						return;
					}
					return Promise.reject(reason);

				})

				.catch(this.__onError);

		} catch (e) {
			this.__onError(e);
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
		let {video, cues, regions, currentTime, loading} = this.state;

		loading = loading || !video;

		return (
			<div className="transcripted-video">
				<LoadingMask loading={loading}>

					<Video ref="video"
							src={video}
							onTimeUpdate={this.onVideoTimeTick}
							context={this.state.context}
							transcript={true}
							autoPlay/>

					<div className="transcript">
						{
							this.state.error ?
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
