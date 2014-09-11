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

	propTypes: {
 		basePath: React.PropTypes.string.isRequired
	},

	_navChangeHandler: function(evt) {
		console.log('LeftNav::_navChangeHandler %O', evt);
		this.setState({
			nav:Navigation.Store.getNav()
		});
	},

	componentWillMount: function() {
		Navigation.Store.addChangeListener(this._navChangeHandler);
	},

	componentWillUnmount: function() {
		Navigation.Store.removeChangeListener(this._navChangeHandler);
	},

	render: function() {

		var navitems = this.props.items.map(function(v,i,a) {
			console.log(v);
			return (<li><NavDrawerItem record={v} /></li>)
		});

		return (
			<ul className="off-canvas-list">
				<li>{navitems.length}</li>
				{navitems}
				<li><label>My Courses <span className="label radius secondary">4</span></label></li>
				<li><Button onClick={navigateAndClose.bind(this,this.props.basePath + 'library/courses')}>Browse Courses</Button></li>
				<li><Button onClick={navigateAndClose.bind(this,this.props.basePath + 'home')}>Home</Button></li>
				<li><LogoutButton /></li>
			</ul>
		);
	}
});
