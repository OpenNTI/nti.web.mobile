import React from 'react';
import {Mixins} from 'nti-web-commons';
import Redirect from 'navigation/components/Redirect';

export default React.createClass({
	displayName: 'HomeView',
	mixins: [Mixins.BasePath],

	render () {
		return (<Redirect location={this.getBasePath() + 'library/'} />);
	}
});
