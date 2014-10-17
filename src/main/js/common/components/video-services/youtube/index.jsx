/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var ErrorWidget = require('common/components/Error');
var asQueryString = require('common/Utils').toQueryString;

module.exports = React.createClass({
	displayName: 'YouTube-Video',

	render: function() {
		if (!this.props.src) {
			return (<ErrorWidget error="No source"/>);
		}

		var mediaSource = this.props.source;
		var videoId = mediaSource.source[0];

		var args = {
			enablejsapi: 1,
			html5: 1,
			modestbranding: 1,
			autohide: 1,
			wmode: 'transparent',
			rel: 0,
			showinfo: 0,
			autoplay: this.props.autoPlay? 1:0,
			origin: location.protocol + '//' + location.host
		};

		var src = '//www.youtube.com/embed/' + videoId + '?' + asQueryString(args);

		// events: {
		// 	'onReady': Ext.bind(this.playerReady, this),
		// 	'onError': Ext.bind(this.playerError, this),
		// 	'onStateChange': Ext.bind(this.playerStatusChange, this)
		// }

		return this.transferPropsTo(<iframe src={src} frameBorder="0"
			seamless allowFullScreen allowTransparency />);
	}
});
