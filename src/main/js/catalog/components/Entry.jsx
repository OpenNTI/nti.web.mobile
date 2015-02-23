import React from 'react';

import {encodeForURI} from 'dataserverinterface/utils/ntiids';

import {Link} from 'react-router-component';

export default React.createClass({
	displayName: 'Entry',

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	getItem () {return this.props.item;},
	itemChanged () {this.forceUpdate(); },

	componentWillMount () { this.getItem().addListener('changed', this.itemChanged); },
	componentWillUnmount () { this.getItem().removeListener('changed', this.itemChanged); },

	getDetailHref () {
		var item = this.getItem();
		if (!item) {return '';}

		var courseId = encodeForURI(item.getID());
		return `/item/${courseId}/`;
	},


	render () {
		var item = this.getItem();

		if (!item) {return;}

		let icon = item && item.icon;

		return (
			<li className="catalog-item">
				<Link href={this.getDetailHref()}>
					<div className="thumbnail" style={{backgroundImage: icon && `url(${icon})`}}/>
					{this.button()}
					<label>
						<h3>{item.Title}</h3>
						<h5>{item.ProviderUniqueID}</h5>
					</label>
				</Link>
			</li>
		);
	},


	isMaybeEnrolled () {
		var item = this.getItem();
		if (!item) {return;}

		let {Items} = item.EnrollmentOptions;

		for(let prop of Object.keys(Items)) {
			let opt = Items[prop];
			if(opt.IsEnrolled) {
				return true;
			}
		}
	},


	button () {
		return this.isMaybeEnrolled() ?
			<button className="drop" href={this.getDetailHref()}>Drop</button> :
			<button className="add" href={this.getDetailHref()}>Add</button>
		;
	}
});
