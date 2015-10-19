import React from 'react';
import {BLANK_AVATAR, BLANK_GROUP_AVATAR} from '../constants/DataURIs';

import {resolve, getDebugUsernameString} from '../utils/user';
import ProfileLink from 'profile/mixins/ProfileLink';

const DEFAULT = { entity: {avatarURL: BLANK_AVATAR }};
const DEFAULT_GROUP = { entity: {avatarURL: BLANK_GROUP_AVATAR }};

import cx from 'classnames';

function deprecated (o, k) { if (o[k]) { return new Error('Deprecated, use "entity"'); } }

export default React.createClass({
	displayName: 'Avatar',


	mixins: [ProfileLink],


	propTypes: {
		entity: React.PropTypes.oneOfType([
			React.PropTypes.object,
			React.PropTypes.string
		]).isRequired,

		username: deprecated,
		user: deprecated,

		suppressProfileLink: React.PropTypes.bool,
		className: React.PropTypes.string
	},


	getDefaultProps () {
		return {
			suppressProfileLink: false
		};
	},


	getInitialState () {
		return {};
	},

	componentWillMount () { this.fillIn(); },
	componentWillReceiveProps (nextProps) {
		if (this.props.entity !== nextProps.entity) {
			this.fillIn(nextProps);
		}
	},


	fillIn (props = this.props) {

		this.setState({loading: true});

		resolve(props)
			.catch(e => console.warn(e) || DEFAULT)
			.then(x => this.setState({
				entity: x,
				color: this.getColorClass(x),
				loading: false
			}));
	},


	getColorClass (entity) {

		function hash (str) {
			let h = 0, c;
			if (str.length === 0) {
				return h;
			}

			for (let i = 0; i < str.length; i++) {
				c = str.charCodeAt(i);
				/*eslint-disable no-bitwise */
				h = ((h << 5) - h) + c;
				h = h & h; // Convert to 32bit integer
				/*eslint-enable no-bitwise */
			}
			return h;
		}

		const NUM_COLORS = 12;

		let hashedString = (typeof entity === 'string'
								? entity
								: (entity || {}).Username) || 'unknown';

		let idx = Math.abs(hash(hashedString)) % NUM_COLORS;

		return `avatar-color-${idx}`;
	},


	isGroup () {
		return /\..*(friendslist|community)/i.test((this.state.entity || {}).MimeType);
	},


	setUnknown () {
		if (!this.isMounted()) {
			return;
		}
		this.setState(this.isGroup() ? DEFAULT_GROUP : DEFAULT);
	},


	fallback () {
		return this.isGroup() ? BLANK_GROUP_AVATAR : BLANK_AVATAR;
	},


	render () {
		let {loading, entity, color} = this.state;
		let {className} = this.props;
		let css = cx('avatar', color, className);

		if (loading) { return null; }

		let {avatarURL, initials, displayName} = entity || {};

		let props = Object.assign({}, this.props, {
			'data-for': getDebugUsernameString(entity),
			alt: 'Avatar for ' + displayName,
			className: css,
			onClick: this.props.suppressProfileLink ? null : this.navigateToProfile.bind(this, this.props.entity)
		});

		return avatarURL ? (
				<img {...props} src={avatarURL} onError={this.setUnknown}/>
			) : initials ? (
				<svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 32 32">
					<text textAnchor="middle" x="16px" y="21px">{initials}</text>
				</svg>
			) : (
				<img {...props} src={this.fallback()}/>
			);
	}
});
