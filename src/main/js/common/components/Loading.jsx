/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var isEmpty = require('dataserverinterface/utils/isempty');

module.exports = React.createClass({
	displayName: 'Loading',

	propType: {
		maskScreen: React.PropTypes.bool,
		loading: React.PropTypes.bool,
		message: React.PropTypes.string,
		tag: React.PropTypes.string,
	},


	getDefaultProps: function() {
		return {
			tag: 'div',
			message: 'Loading'
		};
	},


	render: function() {
		var Tag = React.DOM[this.props.tag];
		if (!isEmpty(this.props.children) && !this.props.loading) {
			return Tag(Object.assign({}, this.props), this.props.children);
		}

		if (this.props.maskScreen) {
			return (
				<div className="mask-loader">
					{this._renderSpiner()}
				</div>
			);
		}

		return this._renderSpiner();
	},


	_renderSpiner: function () {
		return (
			<figure className="loading">
				<div className="m spinner"></div>
				<figcaption>{this.props.message}</figcaption>
			</figure>
		);
	}
});
