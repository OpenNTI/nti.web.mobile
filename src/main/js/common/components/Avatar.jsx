/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var constants = require('../constants/DataURIs');
var Utils = require('../Utils');
var urlJoin = require('dataserverinterface/utils/urljoin');

module.exports = React.createClass({
	displayName: 'Avatar',

	propTypes: {
		username: React.PropTypes.string.isRequired
	},


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
		});
	},


	setUnknown: function() {
		if (!this.isMounted()) {
			return;
		}
		console.log('Failed to load avatar: %s', this.getDOMNode().src);
		this.setState({
			avatar: constants.BLANK_AVATAR
		});
	},


	_buildAvatarURL: function(username) {
		//This is very special case... please do not use this as a pattern.
		return username ?
			urlJoin(Utils.getServerURI(), 'users', username, '@@avatar') :
			constants.BLANK_AVATAR;
	},


	render: function() {
		var user = this.props.username;

		var props = {
			'data-for': user,
			src: this.state.avatar,
			alt: 'Avatar for ' + user,
			onError: this.setUnknown
		};

		return this.transferPropsTo(React.DOM.img(props));
	}
});
