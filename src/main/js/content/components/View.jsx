import React from 'react';
import Router from 'react-router-component';

import Page from 'common/components/Page';
import BasePathAware from 'common/mixins/BasePath';

import Viewer from './Viewer';

export default React.createClass({
	displayName: 'ContentView',
	mixins: [BasePathAware],

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
									title="Content"
									contextProvider={this.__getContext}/>
			</Router.Locations>
		);
	},


	/**
	* Resolves the current context given the props from the direct decendent
	* that asks.
	*
	* @param {Object} props The props set from the handler of the route.
	*/
	__getContext (/*props*/) {
		return Promise.resolve([
			{
				label: 'Books',
				href: this.getBasePath()
			}, {
				// ntiid: course.getID(),
				// label: presentation.title,
				// href: path.join(this.getBasePath(), 'course', this.props.course, '/o/')
			}
		]);
	}
});
