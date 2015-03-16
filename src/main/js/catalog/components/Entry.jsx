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
		let item = this.getItem();
		if (!item) {return '';}

		let courseId = encodeForURI(item.getID());
		return `/item/${courseId}/`;
	},


	render () {
		let item = this.getItem();

		if (!item) {return;}

		let icon = item && item.icon;

		return (
			<li className="catalog-item">
				<Link href={this.getDetailHref()}>
					<div className="thumbnail" style={{backgroundImage: icon && `url(${icon})`}}/>
					<label>
						<h3>{item.Title}</h3>
						<h5>{item.ProviderUniqueID}</h5>
					</label>
					{this.button()}
				</Link>
			</li>
		);
	},


	getStatus () {
		let item = this.getItem();
		let enrolled = false;
		let available = false;
		let dropable = false;

		let dropableMime = /openenrollmentoption/i;

		if (!item) {return;}

		let {Items} = item.EnrollmentOptions;

		for(let prop of Object.keys(Items)) {
			let opt = Items[prop];
			dropable = dropable || dropableMime.test(opt.MimeType);
			available = available || Boolean(opt.IsAvailable);
			enrolled = enrolled || Boolean(opt.IsEnrolled);
		}

		return {enrolled, dropable, available};
	},


	button () {
		let status = this.getStatus();
		let {available, enrolled, dropable} = status || {};

		return (!available && !enrolled) || (!dropable && enrolled) ? null :
			enrolled ?
				<button className="drop" href={this.getDetailHref()}>Drop</button> :
				<button className="add" href={this.getDetailHref()}>Add</button>
			;
	}
});
