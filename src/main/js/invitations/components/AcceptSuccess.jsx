import { join } from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { encodeForURI } from '@nti/lib-ntiids';
import { Mixins } from '@nti/web-commons';

import Redirect from 'navigation/components/Redirect';

export default createReactClass({
	displayName: 'Invitations:Success',

	mixins: [Mixins.BasePath],

	propTypes: {
		instance: PropTypes.object.isRequired,
	},

	render() {
		const { instance } = this.props;
		let href = join(
			'/',
			'item',
			encodeForURI(instance.CatalogEntryNTIID),
			'/'
		);

		return <Redirect location={href} />;
	},
});
