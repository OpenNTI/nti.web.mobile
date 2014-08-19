/** @jsx React.DOM */

var React = require('react/addons');
var LoginActions = require('../../login/LoginActions');
var LoginController = require('../../login/LoginController');
var Button = require('./forms/Button');

module.exports = React.createClass({
	render: function() {

		return (
			<ul className="off-canvas-list">
				<li><label>My Courses <span className="label radius secondary">4</span></label></li>
				<li>
			 		<select>
						<option value="husker">Chemistry of Beer</option>
						<option value="starbuck">Introduction to Water</option>
						<option value="hotdog">Intro to Human Physiology</option>
						<option value="hotdog">Law and Justice</option>
			        </select>
				</li>
				<li><Button>Browse Courses</Button></li>
				<li><Button onClick={LoginActions.logOut} enabled={LoginController.state.isLoggedIn}>Log Out</Button></li>
			</ul>
		);
	}
});
