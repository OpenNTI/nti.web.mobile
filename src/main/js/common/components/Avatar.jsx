/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var constants = require('../constants/DataURIs');
var urlJoin = require('dataserverinterface/utils/urljoin');

module.exports = React.createClass({
	displayName: 'Avatar',

	getDefaultProps: function() {
		return {
		};
	},


	getInitialState: function() {
		return {
			avatar: this._buildAvatarURL(this.props.username)
		};
	},


	componentWillReceiveProps: function(nextProps) {
		this.setState({
			avatar: this._buildAvatarURL(nextProps.username || this.props.username)
		})
	},


	setUnknown: function() {
		this.setState({
			avatar: constants.BLANK_AVATAR
		});
	},


	_buildAvatarURL: function(username) {
		return urlJoin($AppConfig.server, 'users', username, '@@avatar');
	},


	render: function() {
		var user = this.props.username;

		var props = {
			'data-for': user,
			src: constants.BLANK_IMAGE,
			alt: 'Avatar for ' + user,
			onerror: this.setUnknown,
			style: {
				backgroundSize: 'cover',
				backgroundImage: 'url(' + this.state.avatar + ')'
			}
		}

		return this.transferPropsTo(React.DOM.img(props));
	}
});
