import React from 'react';
import {join} from 'path';
import {encodeForURI} from 'nti-lib-ntiids';

import {Mixins} from 'nti-web-commons';
import Redirect from 'navigation/components/Redirect';

export default React.createClass({
	displayName: 'Invitations:Success',

	mixins: [Mixins.BasePath],

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
