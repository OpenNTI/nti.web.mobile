/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Actions = require('../LibraryActions');
var BLANK_IMAGE = require('../../common/constants/DataURIs').BLANK_IMAGE;

module.exports = React.createClass({
	propTypes: {
		item: React.PropTypes.object.isRequired
	},


	componentWillMount: function() {
		this.props.item.addListener('changed', this._onChange);
	},


	componentWillUnmount: function() {
		this.props.item.removeListener('changed', this._onChange);
	},


	_onChange: function(pkg) {
		this.setState(this.state);//force rerender
	},

	_onTap: function() {
		alert('Tap!');
	},

	render: function() {
		var p = this.props.item.getPresentationProperties();
		var style = {
			backgroundImage: 'url(' + p.icon + ')'
		}
		return (
			<li className="library-item" onTouchTap={this._onTap}>
				<img style={style} src={BLANK_IMAGE}/>
				<div className="metadata">
					<h3>{p.title}</h3>
					<h5>{p.label}</h5>
				</div>
			</li>
		);
	}
});
