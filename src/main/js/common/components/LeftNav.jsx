/** @jsx React.DOM */

var React = require('react/addons');
var Button = require('./forms/Button');
var LogoutButton = require('../../login/components/LogoutButton');
var Navigation = require('../../navigation');


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

	getInitialState: function() {
		return {
			nav: []
		};
	},

	componentWillMount: function() {
		Navigation.Store.addChangeListener(this._navChangeHandler);
	},

	componentWillUnmount: function() {
		Navigation.Store.removeChangeListener(this._navChangeHandler);
	},

	render: function() {
		return (
			<ul className="off-canvas-list">
				<li>{this.state.nav.length}</li>
				<li><label>My Courses <span className="label radius secondary">4</span></label></li>
				<li>
			 		<select>
						<option value="husker">Chemistry of Beer</option>
						<option value="starbuck">Introduction to Water</option>
						<option value="hotdog">Intro to Human Physiology</option>
						<option value="hotdog">Law and Justice</option>
			        </select>
				</li>
				<li><Button onClick={navigateAndClose.bind(this,this.props.basePath + 'library/courses')}>Browse Courses</Button></li>
				<li><Button onClick={navigateAndClose.bind(this,this.props.basePath + 'home')}>Home</Button></li>
				<li><LogoutButton /></li>
			</ul>
		);
	}
});
