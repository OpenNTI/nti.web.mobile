import React from 'react';
import Router from 'react-router-component';

import Loading from 'common/components/Loading';
import ErrorWidget from 'common/components/Error';

import SetStateSafely from 'common/mixins/SetStateSafely';

import TranscriptedVideo from './TranscriptedVideo';
import VideoGrid from './VideoGrid';


export default React.createClass({
	displayName: 'MediaView',
	mixins: [SetStateSafely],

	propTypes: {
		course: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
			loading: true, error: false, VideoIndex: null
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
		this.setStateSafely({
			loading: false,
			error: error,
			videoIndex: null
		});
	},


	getDataIfNeeded (props) {
		this.setStateSafely(this.getInitialState());
		try {
			props.course.getVideoIndex()
				.then(VideoIndex =>
					this.setStateSafely({
						loading: false,
						VideoIndex
					}))
				.catch(this.__onError);
		} catch (e) {
			this.__onError(e);
		}
	},


	render () {
		if (this.state.loading) {return (<Loading/>);}
		if (this.state.error) {	return (<ErrorWidget error={this.state.error}/>); }

		let {VideoIndex} = this.state;
		let props = Object.assign({}, this.props, { VideoIndex });

		return (
			<Router.Locations contextual>
				<Router.Location path="/:videoId(/*)" handler={TranscriptedVideo} {...props}/>
				<Router.Location path="/(*)" handler={VideoGrid} {...props}/>
			</Router.Locations>
		);
	}
});
