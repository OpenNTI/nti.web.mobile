/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
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
		var context = this.state.context.splice(-2);
		return (
			<ul className="breadcrumbs" role="menubar" ariaLabel="breadcrumbs">
				{context.map(function(o, i, a) {
					var current = (i === (a.length - 1));
					return this._renderItem(o.label, o.href, current, !o.href, i);
				}.bind(this))}
			</ul>
		);
	},

	_renderItem: function(label, href, current, disabled) {
		var className = disabled ? 'unavailable' : current ? 'current' : null;

		disabled = disabled ? 'true' : null;//don't include the attribute
		return (
			<li role="menuitem" className={className} aria-disabled={disabled}>
				<a href={href}>{label}</a>
			</li>
		);
	}
});
