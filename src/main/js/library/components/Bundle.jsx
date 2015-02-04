import React from 'react/addons';
import {BLANK_IMAGE} from 'common/constants/DataURIs';

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
		var style = {
			backgroundImage: p && p.icon && 'url(' + p.icon + ')'
		};

		return (
			<li className="grid-item">
				<img style={style} src={BLANK_IMAGE}/>
				<div className="metadata">
					<h3>{p.title}</h3>
					<h5>{p.author}</h5>
				</div>
			</li>
		);
	}
});
