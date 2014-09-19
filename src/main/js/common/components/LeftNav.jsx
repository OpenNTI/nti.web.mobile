/** @jsx React.DOM */

var React = require('react/addons');
var Button = require('./forms/Button');
var LogoutButton = require('login/components/LogoutButton');
var Navigation = require('navigation');
var NavDrawerItem = require('navigation/components/NavDrawerItem');


module.exports = React.createClass({

	_upClick: function() {
		if(this._canMove(-1)) {
			this.setState({index: this.state.index - 1});
		}
	},

	_downClick: function() {
		if(this._canMove(1)) {
			this.setState({index: this.state.index + 1});
		}
	},

	_canMove: function (distance) {
		var newIndex = this.state.index + distance;
		return newIndex > -1 && newIndex < this.props.items.length;
	},

	displayName: 'LeftNav',

	componentWillMount: function() {
		this.setState({index: this.props.items.length - 1});
	},

	componentWillReceiveProps: function(nextProps) {
		if(nextProps.items !== this.props.items) {
			this.setState({index: nextProps.items.length - 1});	
		}
	},

	propTypes: {
 		basePath: React.PropTypes.string.isRequired,
 		items: React.PropTypes.array.isRequired
	},

	render: function() {

		var item;
		if(this.props.items.length > 0) {
			var record = this.props.items[this.state.index];
			item = <NavDrawerItem record={record} />;	
		}

		return (
			<ul className="off-canvas-list">
				<li onClick={this._upClick}><a>Back</a></li>
				<li onClick={this._downClick}><a>Content</a></li>
				{item}
				<li><LogoutButton /></li>
			</ul>
		);
	}
});
