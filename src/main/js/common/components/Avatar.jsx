import React from 'react';
import {BLANK_AVATAR, BLANK_GROUP_AVATAR} from '../constants/DataURIs';

import {resolve, getDebugUsernameString} from '../utils/user';

const DEFAULT = { entity: {avatarURL: BLANK_AVATAR }};
// const GROUP_DEFAULT = { entity: {avatarURL: BLANK_GROUP_AVATAR }};

import cx from 'classnames';


const isGroup = RegExp.prototype.test.bind(/\.(friendslist|community)/i);

export default React.createClass({
	displayName: 'Avatar',

	propTypes: {
		username: React.PropTypes.string,
		//or
		entity: React.PropTypes.object,
		user: function(o, k) { if (o[k]) { return new Error('Deprecated, use "entity"'); } },

		className: React.PropTypes.string
	},


	getInitialState () {
		return {};
	},

	componentWillMount () { fillIn(this, this.props); },
	componentWillReceiveProps (nextProps) {
		if (this.props.username !== nextProps.username) {
			fillIn(this, nextProps);
		}
	},


	setUnknown () {
		if (!this.isMounted()) {
			return;
		}
		// TODO: entity.isGroup ? GROUP_DEFAULT : DEFAULT;
		this.setState(DEFAULT);
	},

	fallbackFor(entity) {
		return isGroup((entity || {}).MimeType) ? BLANK_GROUP_AVATAR : BLANK_AVATAR;
	},

	render () {
		let {entity} = this.state;
		let {username, className} = this.props;
		let css = cx('avatar', avatarColorClass(entity || username), className);

		let {avatarURL, initials, displayName} = entity || {};

		let props = Object.assign({}, this.props, {
			'data-for': getDebugUsernameString(username),
			alt: 'Avatar for ' + displayName,
			className: css
		});

		return avatarURL ? (
				<img {...props} src={avatarURL} onError={this.setUnknown}/>
			) : initials ? (
				<svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 32 32">
					<text textAnchor="middle" x="16px" y="21px">{initials}</text>
				</svg>
			) : (
				<img {...props} src={this.fallbackFor(entity)}/>
			);
	}
});

const NUM_COLORS = 13;
function avatarColorClass(entity) {
	let username = typeof entity === 'string' ? entity : (entity || {}).Username || 'unknown';
	let idx = Math.abs(hash(username)) % NUM_COLORS; // % NextThought.util.Format.DEFAULT_AVATAR_BG_COLORS.length;
	let cssClass = `avatar-color-${idx}`; // NextThought.util.Format.DEFAULT_AVATAR_BG_COLORS[idx];
	return cssClass;
}

function hash(str) {
	let h = 0, c;
	if (str.length === 0) {
		return h;
	}
	for (let i = 0; i < str.length; i++) {
		c = str.charCodeAt(i);
		h = ((h << 5) - h) + c;
		h = h & h; // Convert to 32bit integer
	}
	return h;
}

function fillIn (cmp, props) {
	let {entity} = props;
	let promise;

	if (entity) {
		promise = Promise.resolve(entity);
	} else {
		promise = resolve(props);
	}

	promise
		.catch(()=> DEFAULT)
		.then(x => cmp.setState({entity: x}));
}
