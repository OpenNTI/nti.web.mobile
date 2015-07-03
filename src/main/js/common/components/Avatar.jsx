import React from 'react';
import {BLANK_AVATAR} from '../constants/DataURIs';

import {resolve, getDebugUsernameString} from '../utils/user';

const DEFAULT = { entity: {avatarURL: BLANK_AVATAR }};

export default React.createClass({
	displayName: 'Avatar',

	propTypes: {
		username: React.PropTypes.string,
		//or
		entity: React.PropTypes.object,
		user: function() { return new Error('Deprecated, use "entity"'); },

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
		let {entity} = this.state;
		let {username, className} = this.props;
		let css = className || '';

		let {avatarURL, initials, displayName} = entity || {};

		let props = Object.assign({}, this.props, {
			'data-for': getDebugUsernameString(username),
			alt: 'Avatar for ' + displayName,
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
