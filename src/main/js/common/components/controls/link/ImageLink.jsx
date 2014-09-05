/**
* @jsx React.DOM
*/
'use strict';

var React = require('react');
var Router = require('react-router-component');
var NavigatableMixin = Router.NavigatableMixin;
var Environment = Router.environment;


module.exports = React.createClass({
	mixins: [NavigatableMixin],

	displayName: 'ImageLink',

	propTypes: {
		href: React.PropTypes.string.isRequired,
		global: React.PropTypes.bool,
		globalHash: React.PropTypes.bool
	},

	getDefaultProps: function() {
		return {
			activeClassName: 'active'
		};
	},


	isActive: function() {
		return this.getPath() === this.props.href;
	},


	onClick: function(e) {
		if (this.props.onClick) {
			this.props.onClick(e);
		}
		if (!e.defaultPrevented) {
			e.preventDefault();
			this._navigate(this.props.href, function(err) {
				if (err) {
					throw err;
				}
			});
		}
	},


	_navigationParams: function() {
		var params = {};
		for (var k in this.props) {
			if (!this.constructor.propTypes[k]) {
				params[k] = this.props[k];
			}
		}
		return params;
	},


	_createHref: function() {
		return this.props.global ?
			Environment.defaultEnvironment.makeHref(this.props.href) :
			this.makeHref(this.props.href);
	},


	_navigate: function(path, cb) {
		if (this.props.globalHash) {
			return Environment.hashEnvironment.navigate(path, cb);
		}

		if (this.props.global) {
			return Environment.defaultEnvironment.navigate(path, cb);
		}

		return this.navigate(path, this._navigationParams(), cb);
	},


	componentDidMount: function() {
		this._getNavigable().register(this);
	},

	componentWillUnmount: function() {
		this._getNavigable().unregister(this);
	},


	setPath: function() {
		if (this.isMounted()) {
			this.forceUpdate();
			//this.setState({});
		}
	},


	render: function() {

		var activeClass = '',
			props = { onClick: this.onClick, href: this._createHref() };

		if (this.props.activeClassName && this.isActive()) {
			activeClass = this.props.activeClassName;
		}

		return (
			<a href={props.href} onClick={props.onClick} className={(this.props.icon || '') + ' image-link ' + activeClass}>
				<div className="box">{this.props.children}</div>
			</a>
		);
	}
});
