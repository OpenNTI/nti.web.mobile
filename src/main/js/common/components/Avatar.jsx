import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Avatar} from '@nti/web-commons';

import ProfileLink from 'profile/mixins/ProfileLink';


export default createReactClass({
	displayName: 'Mobile:Avatar',
	mixins: [ProfileLink],

	propTypes: {
		entity: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.string
		]),

		suppressProfileLink: PropTypes.bool,
	},

	onClick (e) {
		const {entity} = this.props;
		this.navigateToProfile(entity, e);
	},

	render () {
		const {suppressProfileLink, ...props} = this.props;

		return (
			<Avatar {...props} onClick={suppressProfileLink ? null : this.onClick}/>
		);
	}
});
