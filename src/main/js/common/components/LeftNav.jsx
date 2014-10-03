/** @jsx React.DOM */

var React = require('react/addons');
var Button = require('./forms/Button');
var LogoutButton = require('login/components/LogoutButton');
var Navigation = require('navigation');
var NavDrawerItem = require('navigation/components/NavDrawerItem');

var UP = -1;
var DOWN = 1;

module.exports = React.createClass({

	_upClick: function() {
		if(this._canMove(UP)) {
			this.setState({index: this.state.index - 1});
		}
	},

	_downClick: function() {
		if(this._canMove(DOWN)) {
			this.setState({index: this.state.index + 1});
		}
	},

	_canMove: function(distance) {
		var newIndex = this.state.index + distance;
		return newIndex > -1 && newIndex < this.props.items.length;
	},

	_peek: function(direction) {
		if(this._canMove(direction)) {
			return this.props.items[this.state.index + direction];
		}
		return null;
	},

	_downTitle: function() {
		var next = this._peek(DOWN);
		return next && next.navbarTitle ? next.navbarTitle : 'Content';
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
		var akey = 'navnav';
		if(this.props.items.length > 0) {
			var record = this.props.items[this.state.index];
			item = <NavDrawerItem record={record} key={record.label}/>;
		}

		return (
			<ul className="off-canvas-list">
				{this._canMove(UP) ? <li key="moveUp" className="moveUp"><a onClick={this._upClick}><i className="fi-arrow-left" /> Back</a></li> : null}
				{this._canMove(DOWN) ? <li key="moveDown" className="moveDown"><a onClick={this._downClick}>{this._downTitle()} <i className="fi-arrow-right" /></a></li> : null}
				{item}
				<li key="logoutButton"><LogoutButton /></li>
			</ul>
		);
	}
});
