import React from 'react';
import {BLANK_AVATAR} from '../constants/DataURIs';

import {resolve} from './DisplayName';

const DEFAULT = { user: {avatarURL: BLANK_AVATAR }};

export default React.createClass({
	displayName: 'Avatar',

	propTypes: {
		username: React.PropTypes.string.isRequired,

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

		this.setState(DEFAULT);
	},


	render () {
		let {user} = this.state;
		let {username, className} = this.props;
		let css = className || '';

		let {avatarURL, initials} = user || {};

		let props = Object.assign({}, this.props, {
			'data-for': username,
			alt: 'Avatar for ' + username,
			className: `avatar ${css}`
		});



		return avatarURL ? (
				<img {...props} src={avatarURL} onError={this.setUnknown}/>
			) : initials ? (
				<svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 32 32">
					<text textAnchor="middle" x="16px" y="21px">{initials}</text>
				</svg>
			) : (
				<img {...props} src={BLANK_AVATAR}/>
			);
	}
});



function fillIn (cmp, props) {
	let {user} = props;
	let promise;

	if (user) {
		promise = Promise.resolve(user);
	} else {
		promise = resolve(props);
	}

	promise
		.catch(()=> DEFAULT)
		.then(x => cmp.setState({user: x}));
}
