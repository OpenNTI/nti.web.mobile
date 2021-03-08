import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';

import { Mixins } from '@nti/web-commons';

export default createReactClass({
	displayName: 'Breadcrumb',
	mixins: [Mixins.BasePath],

	propTypes: {
		entity: PropTypes.object.isRequired,
	},

	render() {
		let { entity } = this.props;
		return (
			<ul className="profile-top-controls-breadcrumb">
				<li>
					<a href={`${this.getBasePath()}contacts/groups/`}>Groups</a>
				</li>
				<li>{entity.displayName}</li>
			</ul>
		);
	},
});
