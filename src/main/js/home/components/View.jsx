import React from 'react';
import BasePathAware from 'common/mixins/BasePath';
import Redirect from 'navigation/components/Redirect';

export default React.createClass({
	displayName: 'HomeView',
	mixins: [BasePathAware],

	render () {
		return (<Redirect location={this.getBasePath() + 'library/'} />);
	}
});
