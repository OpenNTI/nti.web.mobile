import * as React from 'react/addons';
import {BLANK_AVATAR} from '../constants/DataURIs';
import {getServerURI} from '../Utils';
import {resolve} from './DisplayName';
import {isNTIID} from 'dataserverinterface/utils/ntiids';

import urlJoin from 'dataserverinterface/utils/urljoin';

export default React.createClass({
	displayName: 'Avatar',

	propTypes: {
		username: React.PropTypes.string.isRequired
	},


	getInitialState () {
		return {
			avatar: BLANK_AVATAR
		};
	},

	componentWillMount () { fillIn(this, this.props); },
	componentWillReceiveProps (nextProps) { fillIn(this, nextProps); },


	setUnknown () {
		if (!this.isMounted()) {
			return;
		}
		console.log('Failed to load avatar: %s', this.getDOMNode().src);
		this.setState({ avatar: BLANK_AVATAR });
	},


	render () {
		var user = this.props.username;

		var props = Object.assign({}, this.props, {
			'data-for': user,
			src: this.state.avatar,
			alt: 'Avatar for ' + user,
			onError: this.setUnknown
		});

		return <img {...props}/>;
	}
});



function fillIn (cmp, props) {
	var user = props.user;
	var username = (user && user.Username) || props.username;
	var promise;

	if (user) {
		promise = Promise.resolve(user.AvatarURL);
	}


	if (!isNTIID(username)){
		promise = Promise.resolve(
			username ?
				urlJoin(getServerURI(), 'users', username, '@@avatar') : BLANK_AVATAR
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
