'use strict';

import React from 'react';
import getSources from './SourceGrabber';
import selectSources from './SelectSources';

import url from 'url';

import {getModel} from 'dataserverinterface';
let MediaSource = getModel('mediasource');

import getEventTarget from 'nti.dom/lib/geteventtarget';

import Loading from 'common/components/Loading';
import {EventHandlers} from '../../Constants';

/**
 * @class KalturaVideo
 *
 * The Kaltura Video source implementation
 */
export default React.createClass({
	displayName: 'KalturaVideo',

	propTypes: {
		/**
		 * Either a URL string or a source descriptor object.
		 *
		 * @type {String/MediaSource}
		 */
		source: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.instanceOf(MediaSource)
			]).isRequired
	},


	getDefaultProps () {
		var p = {};

		// default no-op video event handlers
		Object.keys(EventHandlers)
			.forEach(eventname=>(
				p[EventHandlers[eventname]] =
					e=>console.warn('No handler specified for video event \'%s\'', e.type)
				)
			);

		return p;
	},


	getInitialState () {
		return {
			sources: [],
			sourcesLoaded: false,
			isError: false,
			listening: false
		};
	},


	componentDidMount () {
		var data = this.props.source;
		// kaltura://1500101/0_4ol5o04l/
		var src = typeof data === 'string' && data;
		var parsed = src && url.parse(src);

		var partnerId;
		var entryId;

		if (src) {
			partnerId = parsed.host;
			entryId = /\/(.*)\/$/.exec(parsed.path)[1];
		} else if (data) {
			parsed = ((data.source || [])[0] || '').split(':');
			partnerId = parsed[0];
			entryId = parsed[1];
		}

		this.setState({
			partnerId: partnerId
		});

		getSources({ entryId: entryId, partnerId: partnerId })
			.then(this.setSources);

	},


	setSources (data) {
		if (!this.isMounted()) {
			return;
		}

		var qualityPreference = this.state.quality;//TODO: allow selection...
		var sources = selectSources(data.sources || [], qualityPreference);
		var availableQualities = sources.qualities;

		this.setState({
			duration: data.duration,
			poster: data.poster,
			sources: sources,
			allSources: data.sources,
			qualities: availableQualities,
			sourcesLoaded: true,
			isError: (data.objectType === 'KalturaAPIException')
		});

		if (this.state.interacted) {
			this.doPlay();
		}
	},


	componentDidUpdate () {
		var video = this.refs.video;
		var props = this.props;

		if (video && !this.state.listening) {
			video = video.getDOMNode();
			video.addEventListener('error', this.onError, false);

			if (this.props.autoPlay) {
				this.doPlay();
			}

			//attempt to tell the WebView to play inline...
			video.setAttribute('webkit-playsinline', true);

			Object.keys(EventHandlers).forEach(eventname => {

				video.addEventListener(eventname, props[EventHandlers[eventname]], false);
			});

			this.setState({listening: true});
		}
	},


	componentWillUnmount () {
		var video = this.getDOMNode();
		if (video) {
			Object.keys(EventHandlers).forEach(eventname =>
				video.removeEventListener(eventname, this.props[EventHandlers[eventname]], false)
			);
		}
	},


	render () {

		if(!this.state.sourcesLoaded) {
			return <Loading/>;
		}

		if(this.state.isError) {
			return (<div className="error">Unable to load video.</div>);
		}

		var videoProps = Object.assign({}, this.props, {
			ref: 'video',
			controls: !/iP(hone|od)/i.test(navigator.userAgent),
			poster: this.state.poster,
			src: null,
			source: null,
			onClick: this.doPlay
		});

		Object.keys(this.props).forEach(key => {
			if (/^on/i.test(key)) {
				videoProps[key] = null;
			}
		});

		var interacted = this.state.interacted ? 'loaded' : '';

		return (
			<div className={'video-wrapper ' + interacted}>
				<video {...videoProps}>
					{this.renderSources()}
				</video>
				{!this.state.interacted && <a className="tap-area play" href="#" onClick={this.doPlay}
						style={{backgroundImage: 'url('+this.state.poster+')'}}/>}
			</div>
		);
	},


	renderSources () {
		var sources = this.state.sources || [];
		var Tag = 'source';
		return sources.map(source=> (
			<Tag key={source.src} src={source.src} type={source.type}/>
		));
	},


	onError () {
		this.setState({
			error: 'Could not play video. Network or Browser error.'
		});
	},


	doPlay (e) {
		var isAnchor = e && getEventTarget(e, 'a');

		if (isAnchor) {
			e.preventDefault();
			e.stopPropagation();
		}

		this.play();
	},


	play () {
		var {video} = this.refs;
		if (video && this.isMounted()) {
			this.setState({interacted: true});
			video = video.getDOMNode();
			if(video.play){video.play();}
		}
	},


	pause () {
		var video = this.refs;
		if (video && this.isMounted()) {
			video = video.getDOMNode();
			if(video.pause){video.pause();}
		}
	},


	stop () {
		var {video} = this.refs;
		if (video && this.isMounted()) {
			video = video.getDOMNode();
			if(video.stop){video.stop();}
		}
	},


	setCurrentTime (time) {
		var {video} = this.refs;
		if (video && this.isMounted()) {
			video.getDOMNode().currentTime = time;
		}
	}
});
