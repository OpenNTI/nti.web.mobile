import React from 'react';
import createReactClass from 'create-react-class';
import { Mixins } from '@nti/web-commons';

import Redirect from 'navigation/components/Redirect';

export default createReactClass({
	displayName: 'HomeView',
	mixins: [Mixins.BasePath],

	render() {
		return <Redirect location={this.getBasePath() + 'library/'} />;
	},
});
