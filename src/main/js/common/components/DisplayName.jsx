import React from 'react';
import {getService} from '../utils';

/**
 * This DisplayName component can use the full User instance if you have it.
 * Otherwise, it will take a username prop. If you do not have the full user
 * object, and you want to show the display name, do not resolve the full user
 * object yourself just to pass to this componenent. Only resolve the user IF
 * and ONLY IF you need it for something else. Most likely. If its a link, or
 * something, use the corresponding Component, do not roll your own.
 */
export default React.createClass({
	displayName: 'DisplayName',

	propTypes: {
		username: React.PropTypes.string,
		tag: React.PropTypes.string
	},

	getInitialState () {
		return {
			displayName: 'Resolving...'
		};
	},


	componentDidMount () { fillIn(this, this.props); },

	componentWillReceiveProps (nextProps) {
		if (this.props.username !== nextProps.username) {
			fillIn(this, nextProps);
		}
	},

	render () {
		let Tag = this.props.tag || 'span';
		let displayName = this.state.displayName;

		let props = Object.assign({
			'data-for': this.props.username,
			className: 'username'
		}, this.props);

		return <Tag {...props}>{displayName}</Tag>;
	}
});


export function resolve (cmp, props) {
	let username = props.username;
	let user = props.user;
	let promise;

	if (!username && !user) {
		promise = Promise.reject();
	}

	promise = promise || (user && Promise.resolve(user));

	if (!promise) {
		promise = getService()
			.then(service=>service.resolveUser(username));
	}

	return promise;
}


function fillIn(cmp, props) {

	resolve(cmp, props).then(
		user => {
			if (cmp.isMounted()) {
				cmp.setState({ displayName: user.DisplayName });
			}
		},
		()=> {
			if (cmp.isMounted()) {
				cmp.setState({ displayName: 'Unknown' });
			}
		});

}
