import React from 'react';
import {DisplayName} from 'nti-web-commons';
import ProfileLink from 'profile/mixins/ProfileLink';

function deprecated (o, k) { if (o[k]) { return new Error('Deprecated, use "entity"'); } }

export default React.createClass({
	displayName: 'Mobile:DisplayName',
	mixins: [ProfileLink],

	//Mirror the propTypes of the Common DisplayName
	propTypes: {
		localeKey: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.func
		]),

		tag: React.PropTypes.any,

		entity: React.PropTypes.oneOfType([
			React.PropTypes.object,
			React.PropTypes.string
		]).isRequired,

		username: deprecated,
		user: deprecated,

		suppressProfileLink: React.PropTypes.bool,

		/**
		 * Specifies to substitute your name with "You".
		 *
		 * @type {boolean}
		 */
		usePronoun: React.PropTypes.bool,

		/**
		 * Sharing Scopes (entity objects) are given GeneralNames by the suggestion provider.
		 * This flag will instruct this component to use that designation instead of the displayName.
		 *
		 * @type {boolean}
		 */
		useGeneralName: React.PropTypes.bool
	},

	onClick (e) {
		const {entity} = this.props;
		this.navigateToProfile(entity, e);
	},

	render () {
		const {suppressProfileLink, ...props} = this.props;

		return <DisplayName {...props} onClick={suppressProfileLink ? null : this.onClick}/>;
	}
});
