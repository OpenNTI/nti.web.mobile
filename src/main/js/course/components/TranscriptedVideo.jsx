/** @jsx React.DOM */
'use strict';

var vtt = require("vtt.js"),//https://github.com/mozilla/vtt.js
	WebVTT = vtt.WebVTT,
	VTTCue = vtt.VTTCue/*,
	VTTRegion = vtt.VTTRegion*/;


var React = require('react/addons');

var Model = require('dataserverinterface/models/Video');
var call = require('dataserverinterface/utils/function-call');

var DomUtils = require('common/Utils').Dom;
var addClass = DomUtils.addClass;
var removeClass = DomUtils.removeClass;

var LoadingMask = require('common/components/Loading');
var Pager = require('common/components/Pager');
var Video = require('video').Component;

/*
	See: https://github.com/mozilla/vtt.js#usage

*/

module.exports = React.createClass({
	displayName: 'TranscriptedVideo',


	getInitialState: function() {
		return {
			loading: true,
			error: false,
			cues: null,
			regions: null,
			currentTime: 0
		};
	},

	__getContext: function() {
		this.props.contextProvider(this.props).then(function(result) {
			this.setState({
				context: result
			});
		}.bind(this));
	},

	componentDidMount: function() {
		//Store.addChangeListener(this._onChange);
		this.getDataIfNeeded(this.props);
		addClass(document.body, 'dark');
		this.__getContext();
	},


	componentWillUnmount: function() {
		//Store.removeChangeListener(this._onChange);
		removeClass(document.body, 'dark');
	},


	componentWillReceiveProps: function(nextProps) {
		if (nextProps.video !== this.props.video) {
			this.getDataIfNeeded(nextProps);
		}
		this.__getContext();
	},

	__onError: function(error) {
		this.setState({
			loading: false,
			error: error,
			data: null
		});
	},


	getDataIfNeeded: function(/*props*/) {
		this.setState(this.getInitialState());
		try {
			this.props.video.getTranscript('en').then(
				function whenLoaded(vtt) {
					var parser = new WebVTT.Parser(global, WebVTT.StringDecoder()),
	        			cues = [], regions = [];

				    parser.oncue = function(cue) { cues.push(cue); };
					parser.onregion = function(region) { regions.push(region); };
					parser.onparsingerror = function(e) { throw e; };

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

				}.bind(this),

				function whenRejected(reason) {
					if (reason === Model.NO_TRANSCRIPT ||
						reason === Model.NO_TRANSCRIPT_LANG) {
						this.setState({
							loading: false, cues: null, regions: null });
						return;
					}
					return Promise.reject(reason);

				}.bind(this))

				.catch(this.__onError);

		} catch (e) {
			this.__onError(e);
		}
	},


	onVideoTimeTick: function(event) {
		var time = (event.target || {}).currentTime;
		if (this.isMounted()) {
			this.setState({currentTime: time});
		}
	},


	onJumpTo: function (time) {
		this.refs.video.setCurrentTime(parseFloat(time));
	},


	render: function() {
		var collection=this.props.parentPath;
		var state = this.state;
		var pages = this.props.video.getPageSource();

		return (
			<div className="transcripted-video">
				<a href={collection} className="toolbar-button-left fi-thumbnails"/>
				<Pager pageSource={pages} current={this.props.video.getID()}/>
				<LoadingMask loading={this.state.loading}>
					<Video ref="video" src={this.props.video} onTimeUpdate={this.onVideoTimeTick} context={this.state.context} transcript={true} autoPlay/>
					<div className="transcript">
						{
							this.state.error ?
								<div>Transcript not available</div> :
								<Transcript ref="transcript" cues={state.cues} regions={state.regions} onJumpTo={this.onJumpTo}	currentTime={state.currentTime}/>
						}
					</div>
				</LoadingMask>
			</div>
		);
	}
});


var Transcript = React.createClass({
	displayName: 'Transcript',


	onJumpToCue: function(e) {
		e.preventDefault();
		call(this.props.onJumpTo, e.target.getAttribute('data-start-time'));
	},


	renderCues: function(cue) {
		var divider = null;
		var time = this.props.currentTime;

		var active = (cue.startTime < time && time <= cue.endTime) ? 'active' : '';

		//There is HTML escaped text in the cue, so we have to
		// use: "dangerouslySetInnerHTML={{__html: ''}}"
		return [
			divider,
			(<a href="#" data-start-time={cue.startTime}
				className={active}
				onClick={this.onJumpToCue}
				dangerouslySetInnerHTML={{__html: cue.text}}/>)
		];
	},


	render: function() {
		return (
			<div className="cues">
				{(this.props.cues || []).map(this.renderCues)}
			</div>
		);
	}
});
