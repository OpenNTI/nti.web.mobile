/** @jsx React.DOM */
'use strict';

var path = require('path');
var React = require('react/addons');
var NTIID = require('dataserverinterface/utils/ntiids');
var Video = require('common/components/Video');
var LoadingMask = require('common/components/Loading');

module.exports = React.createClass({
	displayName: 'CourseOverviewVideo',

	propTypes: {
		item: React.PropTypes.object.isRequired,
		course: React.PropTypes.object.isRequired,
		basePath: React.PropTypes.string.isRequired
	},

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.ntivideo/i,
		handles: function(item) {
			return this.mimeTest.test(item.MimeType);
		}
	},

	getInitialState: function() {
		return {
			loading: false,
			error: false,
			video: false
		};
	},



	__onError: function(error) {
		this.setState({
			loading: false,
			error: error,
			video: null
		});
	},


	onPlayClicked: function(e) {
		e.preventDefault();
		e.stopPropagation();
		try {
			var props = this.props,
				course = props.course,
				item = props.item;

			this.setState({loading: true});
			course.getVideoIndex()
				.then(function(videoIndex) {
					this.setState({
						loading: false,
						video: videoIndex.get(item.NTIID)
					});
				}.bind(this))
				.catch(this.__onError);
		} catch (e) {
			this.__onError(e);
		}
	},


	onStop: function() {
		this.setState({video: null});
	},


	render: function() {
		var props = this.props;
		var item = props.item;
		var style = {
			backgroundImage: 'url(' + item.poster + ')'
		};

		var link = path.join(props.basePath,
			'course', NTIID.encodeForURI(props.course.getID()),
			'v', NTIID.encodeForURI(item.NTIID))  + '/';


		return (
			<li style={style} className="video-wrap flex-video widescreen">
				{this.state.video ?
				<Video ref="video" src={this.state.video} autoPlay onPause={this.onStop} onEnded={this.onStop} /> :
				<LoadingMask loading={this.state.loading} tag="a" onFocus={props.onFocus} className="tap-area" href={link}>
					<div className="wrapper">
						<div className="buttons">
							<span className="play" title="Play" onClick={this.onPlayClicked}/>
							<span className="label" title={item.label}>{item.label}</span>
						</div>
					</div>
				</LoadingMask>
				}
			</li>
		);
	}//controls autobuffer autoplay loop
});
