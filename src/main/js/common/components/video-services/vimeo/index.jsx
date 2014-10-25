/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var ErrorWidget = require('common/components/Error');
var asQueryString = require('common/Utils').toQueryString;

var guid = require('dataserverinterface/utils/guid');

var Source = module.exports = React.createClass({
	displayName: 'Vimeo-Video',

	statics: {
		getId: function(url) {
			var regExp = /^.*vimeo(\:\/\/|\.com\/)(.+)/i,
				match = url.match(regExp);
			if (match && match[2]) {
				return match[2];
			}
			return null;
		}
	},

		var mediaSource = this.props.source;
		var videoId = mediaSource.source[0];
		var playerId = '';

		var args = {
			api: 1,
			player_id: playerId,
			//autopause: 0, //we handle this for other videos, but its nice we only have to do this for cross-provider videos.
			autoplay: 0,
			badge: 0,
			byline: 0,
			loop: 0,
			portrait: 0,
			title: 0
		};

		var src = '//player.vimeo.com/video/' + videoId + '?' + asQueryString(args);


		return this.transferPropsTo(<iframe frameBorder="0" src={src}
			seemless allowFullScreen allowTransparency />);
	}
});
