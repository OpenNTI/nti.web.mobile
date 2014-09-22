/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Loading = require('common/components/Loading');
var Error = require('common/components/Error');

var Actions = require('../Actions');
var Store = require('../Store');

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

		var videoIndex = this.state.videoIndex;
		var video = videoIndex[this.props.videoId];

		return (
			<div>{this.props.videoId}</div>
		);
	}
});
