import React from 'react';
import Router from 'react-router-component';

import Viewer from './Viewer';

export default React.createClass({
	displayName: 'ContentView',

	propTypes: {
		packageId: React.PropTypes.string
	},


	render () {

		return (
			<Router.Locations contextual>
				<Router.Location path="/*"
									rootId={this.props.pkgId}
									handler={Viewer}
									slug="/content/"
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

		return Promise.resolve([]);
	}
});
