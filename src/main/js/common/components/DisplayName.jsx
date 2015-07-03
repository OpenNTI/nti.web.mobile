import React from 'react';

import cx from 'classnames';

import {resolve, getDebugUsernameString} from '../utils/user';

import t from 'common/locale';

import {getAppUsername} from 'common/utils';

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

		//One of these two Props (username, and user) are required. User trumps Username.
		username: React.PropTypes.string,
		//or
		user: React.PropTypes.object,

		/**
		 * Specifies to substitute your name with "You".
		 *
		 * @type {boolean}
		 */
		usePronoun: React.PropTypes.bool
	},


	getDefaultProps () {
		return {
			onResolve: () => {}
		};
	},


	getInitialState () {
		return {
			displayName: 'Resolving...'
		};
	},


	componentDidMount () { fillIn(this, this.props); },

	componentWillReceiveProps (nextProps) {
		let {user, username} = this.props;
		if (username !== nextProps.username || user !== nextProps.user) {
			fillIn(this, nextProps);
		}
	},

	render () {
		let {className, localeKey, username, tag} = this.props;
		let {displayName} = this.state;
		let Tag = tag || (localeKey ? 'address' : 'span');

		let props = Object.assign({
			className: cx('username', className),
			children: displayName,
			'data-for': getDebugUsernameString(username)
		}, this.props);

		if (localeKey) {
			let name = React.renderToStaticMarkup(<a rel="author" className="username">{displayName}</a>);

			Object.assign(props, {
				children: void 0,
				dangerouslySetInnerHTML: {'__html': t(localeKey, {name})}
			});
		}

		return <Tag {...props} rel="author"/>;
	}
});


function fillIn(cmp, props) {
	let appuser = getAppUsername();
	let {usePronoun} = props;
	let task = Date.now();
	let set = state => {
		if (cmp.state.task === task) {
			cmp.setState(state);
		}
	};

	cmp.setState({task}, ()=> resolve(props)
		.then(
			user => {
				let displayName = (usePronoun && user.getID() === appuser)
					? 'You'
					: user.displayName;

				set({ displayName });
			},
			()=> set({ failed: true, displayName: 'Unknown' })
		));

}
