/* See: https://github.com/mozilla/vtt.js#usage */
import {
	WebVTT,
	VTTCue/*, VTTRegion*/
} from "vtt.js";

import React from 'react';


import {Dom} from 'common/Utils';
var {addClass} = Dom;
var {removeClass} = Dom;

import Pager from 'common/components/Pager';
import LoadingMask from 'common/components/Loading';

import {Component as Video} from 'video';

import Transcript from './Transcript';


export default React.createClass({
	displayName: 'TranscriptedVideo',


	getInitialState () {
		return {
			loading: true,
			error: false,
			cues: null,
			regions: null,
			currentTime: 0
		};
	},

	__getContext () {
		this.props.contextProvider(this.props).then(context =>
			this.setState({ context }));
	},

	componentDidMount () {
		this.getDataIfNeeded(this.props);
		addClass(document.body, 'dark');
		this.__getContext();
	},


	componentWillUnmount () {
		removeClass(document.body, 'dark');
	},


	componentWillReceiveProps (nextProps) {
		if (nextProps.video !== this.props.video) {
			this.getDataIfNeeded(nextProps);
		}
		this.__getContext();
	},

	__onError (error) {
		this.setState({
			loading: false,
			error: error,
			data: null
		});
	},


	getDataIfNeeded (props) {
		this.setState(this.getInitialState());
		try {
			let {video} = props;

			video.getTranscript('en')
				.then(vtt => {
					var parser = new WebVTT.Parser(global, WebVTT.StringDecoder()),
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

					this.setState({
						loading: false,
						cues: cues,
						regions: regions
					});

				})
				.catch(reason=> {
					if (reason === video.NO_TRANSCRIPT ||
						reason === video.NO_TRANSCRIPT_LANG) {
						this.setState({
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
		var time = (event.target || {}).currentTime;
		if (this.isMounted()) {
			this.setState({currentTime: time});
		}
	},


	onJumpTo  (time) {
		this.refs.video.setCurrentTime(parseFloat(time));
	},


	render () {
		var collection=this.props.parentPath;
		var {cues, regions, currentTime} = this.state;
		var pages = this.props.video.getPageSource();

		return (
			<div className="transcripted-video">
				<a href={collection} className="toolbar-button-left fi-thumbnails"/>
				<Pager pageSource={pages} current={this.props.video.getID()}/>
				<LoadingMask loading={this.state.loading}>

					<Video ref="video"
							src={this.props.video}
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
