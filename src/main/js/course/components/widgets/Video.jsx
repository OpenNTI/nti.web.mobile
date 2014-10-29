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
		mimeTest: /^application\/vnd\.nextthought\.ntivideo$/i,
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

	__getContext: function() {
		this.props.contextProvider(this.props).then(function(result) {
			this.setState({
				context: result
			});
		}.bind(this));
	},

	__onError: function(error) {
		if (this.isMounted()) {
			this.setState({
				loading: false,
				error: error,
				video: null
			});
		}
	},


	componentDidMount: function() {
		this.__getContext();
		this.fillInVideo(this.props);
	},

	componentWillReceiveProps: function(nextProps) {
		this.__getContext();
		this.fillInVideo(nextProps);
	},


	fillInVideo: function (props) {
		try {
			var course = props.course,
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


	onPlayClicked: function(e) {
		e.preventDefault();
		e.stopPropagation();

		var v = this.refs.video;
		if (v) {
			v.play();
		}
	},


	stop: function() {
		var v = this.refs.video;
		if (v) {
			v.stop();
		}
	},


	onStop: function() {
		if (this.isMounted()) {
			this.setState({playing: false});
		}
	},


	onPlay: function () {
		if (this.isMounted()) {
			this.setState({playing: true});
		}
	},


	render: function() {
		var props = this.props;
		var item = props.item;
		var video = this.state.video;
		var Tag = React.DOM[props.tag || 'div'];
		var style = {
			backgroundImage: 'url(' + item.poster + ')'
		};

		var link = path.join(props.basePath,
			'course', NTIID.encodeForURI(props.course.getID()),
			'v', NTIID.encodeForURI(item.NTIID))  + '/';

		return (
			<Tag className="video-wrap flex-video widescreen">
				<Video ref="video" src={this.state.video} onEnded={this.onStop} onPlaying={this.onPlay} context={this.state.context} />
				{this.state.playing ? null :
				<LoadingMask style={style} loading={this.state.loading} tag="a" onFocus={props.onFocus} className="tap-area" href={link}>
					<div className="wrapper">
						<div className="buttons">
							<span className="play" title="Play" onClick={this.onPlayClicked}/>
							<span className="label" title={item.label}>{item.label}</span>
						</div>
					</div>
				</LoadingMask>
				}
			</Tag>
		);
	}//controls autobuffer autoplay loop
});
