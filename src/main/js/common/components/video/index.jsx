/**
 * @jsx React.DOM
 */
var React = require('react');
var kaltura = require('./kaltura');
require('./kalturaSourceGrabber');
var config = require('./config');

var partnerId = '1500101';

function _sources(entryId,callback) {
	return kWidget.getSources({
		partnerId: partnerId,
		entryId: entryId,
		callback: callback
	});
}

var Video = React.createClass({

	getInitialState: function() {
		return { sources: [] };
	},

	componentDidMount: function() {
		var callback = function(data) {
			this.setState({sources: data.sources || []});
		}.bind(this);
		_sources(
			this.props.entryId,
			callback
		);
	},

	render: function() {
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
