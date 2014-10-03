/** @jsx React.DOM */
'use strict';

var NTIID = require('dataserverinterface/utils/ntiids');

var React = require('react/addons');

var path = require('path');

module.exports = React.createClass({
	displayName: 'VideoGrid',
	propTypes: {
		VideoIndex: React.PropTypes.object.isRequired
	},


	getInitialState: function() {
		return {};
	},


	componentDidMount: function() {},


	componentWillUnmount: function() {},


	componentWillReceiveProps: function(nextProps) {},


	render: function() {
		var props = this.props;
		var Videos = props.VideoIndex;

		function itr(v, i) {
			var poster = v && ((v.sources || [])[0] || {}).poster;
			var style = {
				backgroundImage: 'url(' + poster + ')'
			};

			var link = path.join(
				props.basePath,
				'course', NTIID.encodeForURI(props.course.getID()),
				'v', NTIID.encodeForURI(v.ntiid)) + '/';

			return (
				<li className="grid-item" key={v.ntiid + '-' + i}>
					<div className="flex-video widescreen video-wrap" style={style}>
						<a className="play-centered" title="Play" href={link}/>
					</div>
					<div className="metadata">
						<h3>{v.title}</h3>
					</div>
				</li>
			);
		}

		return (
			<ul className="small-block-grid-1 medium-block-grid-3 large-block-grid-4">
				{Videos.map(itr.bind(this))}
			</ul>
		);
	}
});
