import React from 'react';

import {decodeFromURI} from 'dataserverinterface/utils/ntiids';

import Loading from 'common/components/Loading';
import ErrorWidget from 'common/components/Error';

import TranscriptedVideo from './TranscriptedVideo';
import VideoGrid from './VideoGrid';


export default React.createClass({
	displayName: 'MediaView',

	propTypes: {
		course: React.PropTypes.object.isRequired,
		videoId: React.PropTypes.string
	},

	getInitialState () {
		return {
			loading: true, error: false, videoIndex: null
		};
	},


	componentDidMount () {
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount () {},


	componentWillReceiveProps (nextProps) {
		if (nextProps.course !== this.props.course) {
			this.getDataIfNeeded(nextProps);
		}
	},


	__onError (error) {
		this.setState({
			loading: false,
			error: error,
			videoIndex: null
		});
	},


	getDataIfNeeded (props) {
		this.setState(this.getInitialState());
		try {
			props.course.getVideoIndex()
				.then(data =>
					this.setState({
						loading: false,
						videoIndex: data
					}))
				.catch(this.__onError);
		} catch (e) {
			this.__onError(e);
		}
	},


	render () {
		if (this.state.loading) {return (<Loading/>);}
		if (this.state.error) {	return (<ErrorWidget error={this.state.error}/>); }

		let p = this.props;
		let videoId = p.videoId && decodeFromURI(p.videoId);
		let VideoIndex = this.state.videoIndex;
		let video = VideoIndex.get(videoId);

		let props = Object.assign({}, this.props, {
			VideoIndex,
			videoId,
			video,
			outlineId: this.props.outlineId
		});

		let Tag = videoId ? TranscriptedVideo : VideoGrid;

		return <Tag {...props}/>;
	}
});
