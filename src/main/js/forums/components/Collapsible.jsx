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

		let titleClasses = React.addons.classSet({
			'collapsible-title': true,
			'open': !this.state.collapsed,
			'disclosure-triangle': true
		});

		return (
			<div className={classes}>
				<div className={titleClasses} onClick={this[toggle]}>{this.props.title}</div>
				{this.state.collapsed ? null : this.props.children}
			</div>
		);
	}
});
