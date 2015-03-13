import React from 'react';
import Router from 'react-router-component';

import Page from 'common/components/Page';
import BasePathAware from 'common/mixins/BasePath';
import ContextContributor from 'common/mixins/ContextContributor';

import Viewer from './Viewer';

export default React.createClass({
	displayName: 'ContentView',
	mixins: [BasePathAware, ContextContributor],

	propTypes: {
		packageId: React.PropTypes.string
	},


	render () {

		return (
			<Router.Locations contextual>
				<Router.Location path="/*"
									rootId={this.props.pkgId}
									handler={Page}
									pageContent={Viewer}
									slug="/content/"
									title="Content"/>
			</Router.Locations>
		);
	},


	getContext () {
		return Promise.resolve([
			{
				label: 'Books',
				href: this.getBasePath()
			// }, {
				// ntiid: content.getID(),
				// label: presentation.title,
				// href: ...
			}
		]);
	}
});
