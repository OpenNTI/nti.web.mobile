/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Button = require('./forms/Button');
var LogoutButton = require('login/components/LogoutButton');
var Navigation = require('navigation');
var NavDrawerItem = require('navigation/components/NavDrawerItem');

var UP = -1;
var DOWN = 1;

module.exports = React.createClass({
	displayName: 'LeftNav',
	propTypes: {
		basePath: React.PropTypes.string.isRequired,
		items: React.PropTypes.array.isRequired
	},


	getDefaultProps: function() {
		return {
			items: []
		};
	},


	getInitialState: function() {
		return {
			index: this.props.items.length - 1
		};
	},


	componentWillReceiveProps: function(nextProps) {
		if(nextProps.items !== this.props.items) {
			this.setState({index: nextProps.items.length - 1});
		}
	},


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


	render: function() {

		var akey = 'navnav';
		var basePath = this.props.basePath;
		var record = this.props.items[this.state.index];

		var headerClass = 'moveUp';
		var headerClickHandler = this._upClick;
		var headerIcon = 'fi-arrow-left';
		var headerLabel = ' Back';
		var headerTitle = '';

		if (this._canMove(DOWN)) {
			headerClass = 'moveDown';
			headerClickHandler = this._downClick;
			headerIcon = 'fi-arrow-right';
			headerLabel = '';
			headerTitle = this._downTitle() + ' ';
		} else if (!this._canMove(UP)) {
			headerClass = null;
		}

		return (
			<div>
				<ul className="off-canvas-list">

				{headerClass &&
					<li className={headerClass}><a onClick={headerClickHandler}>{headerTitle}<i className={headerIcon} />{headerLabel}</a></li>}

					<NavDrawerItem record={record} basePath={basePath}/>
				</ul>
				<div className="text-center"><LogoutButton /></div>
			</div>
		);
	}
});
