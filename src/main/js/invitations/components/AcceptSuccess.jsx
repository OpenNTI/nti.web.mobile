import React from 'react';
import {join} from 'path';
import {encodeForURI} from 'nti-lib-ntiids';

import BasePathAware from 'common/mixins/BasePath';
import Redirect from 'navigation/components/Redirect';

export default React.createClass({
	displayName: 'Invitations:Success',

	mixins: [BasePathAware],

	propTypes: {
		instance: React.PropTypes.object.isRequired
	},

	render () {

		const {instance} = this.props;
		let href = join('/', 'item', encodeForURI(instance.CatalogEntryNTIID), '/');

		return (
			<Redirect location={href} />
		);
	}
});
