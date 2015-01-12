'use strict';

var React = require('react/addons');
var ActiveState = require('./ActiveState');

module.exports = React.createClass({

	statics: {
		noContextProvider: function() {
			return Promise.resolve([]);
		}
	},

	displayName: 'Breadcrumb',

	getInitialState: function() {
		return {
			context: []
		};
	},

	componentDidMount: function() {
		this.maybeUpdateContext(this.props);
	},


	componentWillUnmount: function() {},


	componentWillReceiveProps: function(props) {
		this.maybeUpdateContext(props);
	},


	maybeUpdateContext: function(props) {
		var promiseMaker = props.contextProvider;
		var stamp = Date.now();
		if (promiseMaker) {
			this.setState({contextTime: stamp});
			promiseMaker().then(this.__applyContext.bind(this, stamp));
		}
	},


	__applyContext: function(contextTime, context) {
		if (this.state.contextTime === contextTime && this.isMounted()) {
			this.setState({context: context});
		}
	},


	render: function() {
		var context = this.state.context.slice(-2);
		return (
			<ul className="breadcrumbs" role="menubar" aria-label="breadcrumbs">
				{this.props.children}
				{context.map(function(o, i) {
					return this._renderItem(o, !o.href, i);
				}.bind(this))}
			</ul>
		);
	},


	_renderMenu: function(items, className) {
		if (!items || !items.length) {
			return null;
		}
		return (
			<ul className={className} role="menu" aria-label="menu">
				{items.map(function(o, i) {
					return this._renderItem(o, !o.href, i);
				}.bind(this))}
			</ul>
		);
	},


	_renderItem: function(item, disabled, index) {
		var className = disabled ? 'unavailable' : null;

		disabled = disabled ? 'true' : null;//don't include the attribute
		return (
			<ActiveState tag="li" href={item.href}
				key={index}
				role="menuitem"
				className={className}
				activeClassName="current"
				aria-disabled={disabled}>
				<a href={item.href}>{item.label}</a>
				{this._renderMenu(item.children, 'menu')}
			</ActiveState>
		);
	}
});
