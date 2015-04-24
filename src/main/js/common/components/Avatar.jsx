import React from 'react';
import {BLANK_AVATAR} from '../constants/DataURIs';
import {getServerURI} from '../utils';
import {resolve} from './DisplayName';
import {isNTIID} from 'nti.lib.interfaces/utils/ntiids';

import urlJoin from 'nti.lib.interfaces/utils/urljoin';

export default React.createClass({
	displayName: 'Avatar',

	propTypes: {
		username: React.PropTypes.string.isRequired,

		className: React.PropTypes.string
	},


	getInitialState () {
		return {
			avatar: BLANK_AVATAR
		};
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
		console.log('Failed to load avatar: %s', React.findDOMNode(this).src);
		this.setState({ avatar: BLANK_AVATAR });
	},


	render () {
		let {avatar} = this.state;
		let {username, className} = this.props;
		let css = className || '';

		let props = Object.assign({}, this.props, {
			'data-for': username,
			src: avatar,
			alt: 'Avatar for ' + username,
			onError: this.setUnknown,
			className: `avatar ${css}`
		});

		return <img {...props}/>;
	}
});



function fillIn (cmp, props) {
	let user = props.user;
	let username = (user && user.Username) || props.username;
	let promise;

	if (user) {
		promise = Promise.resolve(user.AvatarURL);
	}


	if (!isNTIID(username)){
		promise = Promise.resolve(
			username ?
				urlJoin(getServerURI(), 'users', encodeURIComponent(username), '@@avatar') : BLANK_AVATAR
		);
	}

	if (!promise) {
		promise = resolve(cmp, props).then(obj=>obj.avatarURL);
	}

	promise.then(avatar=>{
		if (cmp.isMounted()) {
			cmp.setState({avatar});
		}
	});
}
