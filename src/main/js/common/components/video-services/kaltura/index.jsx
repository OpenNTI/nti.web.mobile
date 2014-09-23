/**
 * @jsx React.DOM
 */
var React = require('react');
var kaltura = require('./kaltura');

var url = require('url');

var Loading = require('../../Loading');

function _sources(options) {
	return kaltura.getSources(options);
}

var Video = React.createClass({

	getInitialState: function() {
		return { sources: [], sourcesLoaded: false, isError: false };
	},

	componentDidMount: function() {

		var data = this.props.data;
		// kaltura://1500101/0_4ol5o04l/
		var e = this.props.src;
		var parsed = e && url.parse(e);

		var partnerId;
		var entryId;

		if (e) {
			partnerId = parsed.host;
			entryId = /\/(.*)\/$/.exec(parsed.path)[1];
		} else if (data) {
			parsed = ((data.source || [])[0] || '').split(':');
			partnerId = parsed[0];
			entryId = parsed[1];
		}

		_sources({
			entryId: entryId,
			partnerId: partnerId,
			callback: function(data) {
				this.setState({
					duration: data.duration,
					poster: data.poster,
					sources: data.sources || [],
					sourcesLoaded: true,
					isError: (data.objectType == 'KalturaAPIException')
				});
			}.bind(this)
		});

	},

	render: function() {

		if(!this.state.sourcesLoaded) {
			return (<Loading />);
		}

		if(this.state.isError) {
			return (<div className="error">Unable to load video.</div>);
		}

		var srcs = this.state.sources.map(function(val,idx,arr) {
			var s = React.DOM.source(val);
			return s;
		});

		return this.transferPropsTo(<video poster={this.state.poster} src={null} controls>{srcs}</video>);
	}

});

module.exports = Video;
