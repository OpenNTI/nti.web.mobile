import React from 'react';

import cx from 'classnames';

import {resolve, getDebugUsernameString} from '../utils/user';

import t from 'common/locale';

import {getAppUsername} from 'common/utils';

function deprecated(o, k) { if (o[k]) { return new Error('Deprecated, use "entity"'); } }

/**
 * This DisplayName component can use the full User instance if you have it.
 * Otherwise, it will take a username prop. If you do not have the full entity
 * object, and you want to show the display name, do not resolve the full entity
 * object yourself just to pass to this componenent. Only resolve the entity IF
 * and ONLY IF you need it for something else. Most likely. If its a link, or
 * something, use the corresponding Component, do not roll your own.
 */
export default React.createClass({
	displayName: 'DisplayName',

	propTypes: {
		className: React.PropTypes.string,

		localeKey: React.PropTypes.string,

		tag: React.PropTypes.string,

		entity: React.PropTypes.oneOfType([
			React.PropTypes.object,
			React.PropTypes.string
		]).isRequired,

		username: deprecated,
		user: deprecated,

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
			displayName: ''
		};
	},


	componentDidMount () { this.fillIn(); },

	componentWillReceiveProps (nextProps) {
		let {entity} = this.props;
		if (entity !== nextProps.entity) {
			this.fillIn(nextProps);
		}
	},


	fillIn(props = this.props) {
		let appuser = getAppUsername();
		let {usePronoun} = props;
		let task = Date.now();

		let set = state => {
			if (this.state.task === task && this.isMounted()) {
				this.setState(state);
			}
		};

		this.setState({task}, ()=> resolve(props)
			.then(
				entity => {
					let displayName = (usePronoun && entity.getID() === appuser)
						? 'You'
						: entity.displayName;

					set({ displayName });
				},
				()=> set({ failed: true, displayName: 'Unknown' })
			));

	},


	render () {
		let {className, entity, localeKey, tag} = this.props;
		let {displayName} = this.state;
		let Tag = tag || (localeKey ? 'address' : 'span');

		let props = Object.assign({
			className: cx('username', className),
			children: displayName,
			'data-for': getDebugUsernameString(entity)
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
