import React from 'react';


let Pane = React.createClass({

	propTypes: {
		role: React.PropTypes.string.isRequired,
		children: React.PropTypes.element.isRequired
	},

	render () {
		let {role, children} = this.props;
		return (
			<div className={`master-detail-${role}-view`}>
				{children}
			</div>
		);
	}
});


export default React.createClass({
	displayName: 'MasterDetail',

	propTypes: {
		children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired
	},

	render () {
		let [master, detail] = this.props.children;

		let props = Object.assign({}, this.props, { children: undefined });

		return (
			<div className="master-detail-view">
				<Pane {...props} role="master">{master}</Pane>
				<Pane {...props} role="detail">{detail}</Pane>
			</div>
		);
	}
});
