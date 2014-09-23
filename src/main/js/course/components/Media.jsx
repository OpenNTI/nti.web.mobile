/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Loading = require('common/components/Loading');
var Error = require('common/components/Error');

var TranscriptedVideo = require('./TranscriptedVideo');
var VideoGrid = require('./VideoGrid');


module.exports = React.createClass({
	displayName: 'MediaView',

	propTypes: {
		course: React.PropTypes.object.isRequired,
		videoId: React.PropTypes.string
	},

	getInitialState: function() {
		return {
			loading: true, error: false, videoIndex: null
		};
	},


	componentDidMount: function() {
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount: function() {},


	componentWillReceiveProps: function(nextProps) {
		if (nextProps.course !== this.props.course) {
			this.getDataIfNeeded(nextProps);
		}
	},


	__onError: function(error) {
		this.setState({
			loading: false,
			error: error,
			videoIndex: null
		});
	},


	getDataIfNeeded: function(props) {
		this.setState(this.getInitialState());
		try {
			props.course.getVideoIndex()
				.then(function(data) {
					this.setState({
						loading: false,
						videoIndex: data
					})
				}.bind(this))
				.catch(this.__onError);
		} catch (e) {
			this.__onError(e);
		}
	},


	render: function() {
		if (this.state.loading) {return (<Loading/>);}
		if (this.state.error) {	return <Error error={this.state.error}/> }

		var p = this.props;
		var videoId = p.videoId && decodeURIComponent(p.videoId);
		var videoIndex = this.state.videoIndex;
		var video = videoIndex.get(videoId);

		var props = {
			VideoIndex: videoIndex,
			videoId: videoId,
			video: video
		};

		var Tag = videoId ? TranscriptedVideo : VideoGrid;

		return this.transferPropsTo(Tag(props));
	}
});
