/**
 * @jsx React.DOM
 */
var React = require('react');
var kaltura = require('./kaltura');
var url = require('url');
var Loading = require('../Loading');

function _sources(options) {
	return kaltura.getSources(options);
}

var Video = React.createClass({

	getInitialState: function() {
		return { sources: [], sourcesLoaded: false };
	},

	componentDidMount: function() {

		// kaltura://1500101/0_4ol5o04l/
		var e = this.props.src;
		var parsed = url.parse(e);
		var partnerId = parsed.host;
		var entryId = /\/(.*)\/$/.exec(parsed.path)[1];

		_sources({
			entryId: entryId,
			partnerId: partnerId,
			callback: function(data) {
				this.setState({sources: data.sources || [], sourcesLoaded: true });
			}.bind(this)
		});

	},

	render: function() {

		if(!this.state.sourcesLoaded) {
			return (
				<div className="flex-video">
					<Loading />
				</div>
			);
		}

		var srcs = this.state.sources.map(function(val,idx,arr) {
			var s = React.DOM.source(val);
			return s;
		});
		return (
			<div className="flex-video">
				<video controls>{srcs}</video>
			</div>
		);
	}

});

module.exports = Video;
