'use strict';


var React = require('react/addons');
var Router = require('react-router-component');

var Viewer = require('./Viewer');

module.exports = React.createClass({
	displayName: 'ContentView',

	propTypes: {
		packageId: React.PropTypes.string
	},


	render: function() {

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
	__getContext: function(/*props*/) {

		return Promise.resolve([]);
	}
});
