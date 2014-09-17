/** @jsx React.DOM */

var React = require('react/addons');
var Button = require('./forms/Button');
var LogoutButton = require('../../login/components/LogoutButton');
var Navigation = require('../../navigation');
var NavDrawerItem = require('../../navigation/components/NavDrawerItem');


function navigateAndClose(path) {
	Navigation.Actions.navigate(path);
	// $('.off-canvas-wrap').foundation('offcanvas', 'hide', 'move-right');
}

module.exports = React.createClass({
	displayName: 'LeftNav',

	propTypes: {
 		basePath: React.PropTypes.string.isRequired
	},

	// _navChangeHandler: function(evt) {
	// 	console.log('LeftNav::_navChangeHandler %O', evt);
	// 	this.setState({
	// 		nav:Navigation.Store.getNav()
	// 	});
	// },

	// componentWillMount: function() {
	// 	Navigation.Store.addChangeListener(this._navChangeHandler);
	// },

	// componentWillUnmount: function() {
	// 	Navigation.Store.removeChangeListener(this._navChangeHandler);
	// },

	render: function() {

		var navitems = this.props.items.map(function(v,i,a) {
			console.log(v);
			//These li's need a key={} prop...
			//see: http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
			return (<NavDrawerItem record={v} />);
		});

		return (
			<ul className="off-canvas-list side-nav">
				{navitems}
				<li><LogoutButton /></li>
			</ul>
		);
	}
});


/*

	<ul>
		<li><a href="">hi hi hi</a></li>
	</ul>

*/