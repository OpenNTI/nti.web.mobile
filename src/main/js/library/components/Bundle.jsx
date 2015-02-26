import React from 'react';

export default React.createClass({
	displayName: 'Bundle',

	propTypes: {
		item: React.PropTypes.object.isRequired
	},


	getItem () {return this.props.item;},

	itemChanged () { this.forceUpdate(); },

	componentWillMount () {
		this.getItem().addListener('changed', this.itemChanged);},

	componentWillUnmount () {
		this.getItem().removeListener('changed', this.itemChanged);},


	render () {
		var p = this.getItem();
		let {icon} = p || {};

		return (
			<div className="library-item bundle">
				<img src={icon}/>
				<label>
					<h3>{p.title}</h3>
					<h5>{p.author}</h5>
				</label>
			</div>
		);
	}
});
