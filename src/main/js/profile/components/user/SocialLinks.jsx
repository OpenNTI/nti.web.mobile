import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import {scoped} from 'nti-lib-locale';

let t = scoped('PROFILE.ABOUT.SOCIAL');

export default createReactClass({
	displayName: 'SocialLinks',

	socialPropNames: [
		'twitter',
		'googlePlus',
		'linkedIn',
		'facebook'
	],

	propTypes: {
		user: PropTypes.object.isRequired
	},

	render () {

		let {user} = this.props;
		let items = this.socialPropNames.map(prop => {
			return user[prop] ? <li key={prop}><a target="_blank" rel="noopener noreferrer" className={'social-' + prop.toLowerCase()} href={user[prop]}><span>{t(prop)}</span></a></li> : null;
		}).filter(x=>x);

		return (
			items.length > 0 && (
				<ul className="social-links">
					{items}
				</ul>
			)
		);
	}
});
