/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var BLANK_IMAGE = require('common/constants/DataURIs').BLANK_IMAGE;

module.exports = React.createClass({
	displayName: 'Entry',
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
		this.forceUpdate();
	},


	render: function() {
		var p = this.props.item;
		var courseId = encodeURIComponent(this.props.item.getID());
		var style = {
			backgroundImage: 'url(' + p.icon + ')'
		}
		return (
			<li className="library-item">
				<a href={'./' + courseId}>
					<img style={style} src={BLANK_IMAGE}/>
					<div className="metadata">
						<h3>{p.Title}</h3>
						<h5>{p.ProviderUniqueID}</h5>
					</div>
				</a>
			</li>
		);
	}
});
