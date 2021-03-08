import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { DisplayName } from '@nti/web-commons';
import ProfileLink from 'internal/profile/mixins/ProfileLink';

function deprecated(o, k) {
	if (o[k]) {
		return new Error('Deprecated, use "entity"');
	}
}

export default createReactClass({
	displayName: 'Mobile:DisplayName',
	mixins: [ProfileLink],

	//Mirror the propTypes of the Common DisplayName
	propTypes: {
		localeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

		tag: PropTypes.any,

		entity: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
			.isRequired,

		username: deprecated,
		user: deprecated,

		suppressProfileLink: PropTypes.bool,

		/**
		 * Specifies to substitute your name with "You".
		 *
		 * @type {boolean}
		 */
		usePronoun: PropTypes.bool,

		/**
		 * Sharing Scopes (entity objects) are given GeneralNames by the suggestion provider.
		 * This flag will instruct this component to use that designation instead of the displayName.
		 *
		 * @type {boolean}
		 */
		useGeneralName: PropTypes.bool,
	},

	onClick(e) {
		const { entity } = this.props;
		this.navigateToProfile(entity, e);
	},

	render() {
		const { suppressProfileLink, ...props } = this.props;

		return (
			<DisplayName
				{...props}
				onClick={suppressProfileLink ? null : this.onClick}
			/>
		);
	},
});
