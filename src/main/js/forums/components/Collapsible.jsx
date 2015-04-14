import React from 'react';

const toggle = "Collapsible:toggle";

export default React.createClass({
	displayName: 'Collapsible',

	getInitialState: function() {
		return {
			collapsed: true
		};
	},

	[toggle]() {
		this.setState({
			collapsed: !this.state.collapsed
		});
	},

	render () {

		let classes = React.addons.classSet({
			'collapsible': true,
			'collapsed': this.state.collapsed,
			'expanded': !this.state.collapsed
		});

		return (
			<div className={classes}>
				<span className="collapsible-title" onClick={this[toggle]}>{this.props.title}</span>
				{this.state.collapsed ? null : this.props.children}
			</div>
		);
	}
});
