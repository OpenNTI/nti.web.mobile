import React from 'react';

import {getModel} from 'nti.lib.interfaces';
let MediaSource = getModel('mediasource');

import {getEventTarget} from 'nti.lib.dom';

import {EventHandlers} from '../../Constants';


export default React.createClass({
	displayName: 'HTML5Video',

	propTypes: {
		/**
		 * Either a URL string or a source descriptor object.
		 *
		 * @type {String/MediaSource}
		 */
		source: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.instanceOf(MediaSource)
		]).isRequired,

		autoPlay: React.PropTypes.bool
	},


	getDefaultProps () {
		let p = {};

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
			error: false,
			listening: false,
			interacted: false
		};
	},


	componentDidMount () {
		this.setupSource(this.props);
	},


	componentWillReceiveProps (nextProps) {
		if (this.props.source !== nextProps.source) {
			this.setupSource(nextProps);
		}
	},


	setupSource (props) {
		let {source} = props;
		if (typeof source !== 'string') {
			console.warn('What is this?', source);
			source = null;
		}

		this.setState({src: source});
	},


	componentWillUpdate (nextProps) {
		if (nextProps.source !== this.props.source) {
			this.setState(this.getInitialState());
		}
	},


	componentDidUpdate (prevProps) {
		let video = this.refs.video;
		this.ensureListeningToEvents(video);
		if (prevProps.source !== this.props.source) {
			video = video && React.findDOMNode(video);
			if (video) {
				video.load();
			}
		}
	},


	componentWillUnmount () {
		let video = React.findDOMNode(this);
		if (video) {
			Object.keys(EventHandlers).forEach(eventname =>
				video.removeEventListener(eventname, this.props[EventHandlers[eventname]], false)
			);
		}
	},


	ensureListeningToEvents (video) {
		let {props} = this;
		if (video && !this.state.listening) {
			video = React.findDOMNode(video);
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


	render () {
		let {error, interacted, src} = this.state;

		let videoProps = Object.assign({}, this.props, {
			ref: 'video',
			controls: !/iP(hone|od)/i.test(navigator.userAgent),
			src,
			source: null,
			onClick: this.doPlay
		});

		Object.keys(this.props).forEach(key => {
			if (/^on/i.test(key)) {
				videoProps[key] = null;
			}
		});

		return error ? (
			<div className="error">Unable to load video.</div>
		) : (
			<div className={'video-wrapper ' + (interacted ? 'loaded' : '')}>
				<video {...videoProps}/>
				{!interacted && <a className="tap-area play" href="#" onClick={this.doPlay} style={{backgroundColor: 'transparent'}}/>}
			</div>
		);
	},


	onError () {
		this.setState({
			error: 'Could not play video. Network or Browser error.'
		});
	},


	doPlay (e) {
		let isAnchor = e && getEventTarget(e, 'a');

		if (isAnchor) {
			e.preventDefault();
			e.stopPropagation();
		}

		console.log('doPlay');
		this.play();
	},


	play () {
		let {video} = this.refs;
		this.setState({interacted: true});
		if (video && this.isMounted()) {
			video = React.findDOMNode(video);
			if (video.play) {
				video.play();
			}
		}
	},


	pause () {
		let video = this.refs;
		if (video && this.isMounted()) {
			video = React.findDOMNode(video);
			if (video.pause) { video.pause(); }
		}
	},


	stop () {
		let {video} = this.refs;
		if (video && this.isMounted()) {
			video = React.findDOMNode(video);
			if (video.stop) { video.stop(); }
		}
	},


	setCurrentTime (time) {
		let {video} = this.refs;
		if (video && this.isMounted()) {
			React.findDOMNode(video).currentTime = time;
		}
	}
});
