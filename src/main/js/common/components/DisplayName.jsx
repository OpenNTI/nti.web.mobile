import React from 'react';

import cx from 'classnames';

import {getService} from '../utils';

import t from 'common/locale';

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
		className: React.PropTypes.string,

		localeKey: React.PropTypes.string,

		tag: React.PropTypes.string,

		username: React.PropTypes.string.isRequired
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
		let {className, localeKey, username, tag} = this.props;
		let {displayName} = this.state;
		let Tag = tag || (localeKey ? 'address' : 'span');

		let props = Object.assign({
			className: cx('username', className),
			children: displayName
		}, this.props);

		if (localeKey) {
			let name = React.renderToStaticMarkup(<a rel="author" className="username">{displayName}</a>);

			Object.assign(props, {
				children: void 0,
				dangerouslySetInnerHTML: {'__html': t(localeKey, {name})}
			});
		}

		return <Tag {...props} rel="author" data-for={username || 'unknown'}/>;
	}
});


export function resolve (cmp, props) {
	let username = props.username;
	let user = props.user;
	let promise;

	if (!username && !user) {
		promise = Promise.reject('No User or no Username');
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
