import React from 'react';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import BasePathAware from 'common/mixins/BasePath';

const OPEN = Symbol();
const FOR_CREDIT = Symbol();


/*

item.RealEnrollmentStatus can have these values:

#: the parent scopes.
ES_PUBLIC = "Public"

#: This scope extends the public scope with people that have purchase the course
ES_PURCHASED = "Purchased"

#: This scope extends the public scope with people taking the course
#: to earn academic credit. They have probably paid money.
ES_CREDIT = "ForCredit"

#: This scope extends the ForCredit scope to be specific to people who
#: are engaged in a degree-seeking program.
ES_CREDIT_DEGREE = "ForCreditDegree"

#: This scope extends the ForCredit scope to be specific to people who
#: are taking the course for credit, but are not engaged in
#: seeking a degree.
ES_CREDIT_NONDEGREE = "ForCreditNonDegree"

*/


export default React.createClass({
	displayName: 'Entry',
	mixins: [BasePathAware],

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	getItem () { return this.props.item; },
	itemChanged () {this.forceUpdate(); },

	componentWillMount () { this.getItem().addListener('changed', this.itemChanged); },
	componentWillUnmount () { this.getItem().removeListener('changed', this.itemChanged); },

	getDetailHref () {
		let item = this.getItem();
		if (!item) { return ''; }

		let courseId = encodeForURI(item.getID());
		return `${this.getBasePath()}catalog/item/${courseId}/`;
	},


	getAddHref () {
		return `${this.getDetailHref()}enrollment/`;
	},

	getBaseEnrollHref () {
		return `${this.getBasePath()}catalog/enroll/`;
	},

	getDropHref () {
		let item = this.getItem();
		let courseId = encodeForURI(item.getID());
		return `${this.getBaseEnrollHref()}drop/${courseId}/`;
	},



	render () {
		let item = this.getItem();

		if (!item) { return; }

		let {status} = this.getStatus();

		let icon = item && item.icon;

		return (
			<li className="catalog-item">
				<a href={this.getDetailHref()}>
					<div className="thumbnail" style={{backgroundImage: icon && `url(${icon})`}}/>
					<label>
						<h3>{item.Title}</h3>
						<div>
							<h5>{item.ProviderUniqueID}</h5>
							{status && (
								<h5>{status !== FOR_CREDIT && <span>Not</span>} For Credit</h5>
							)}
						</div>
					</label>
				</a>
				{this.button()}
			</li>
		);
	},


	getStatus () {
		let item = this.getItem();
		let enrolled = false;
		let available = false;
		let dropable = false;

		let dropableMime = /openenrollmentoption/i;
		let forCredit = /forcredit/i;

		if (!item) { return; }

		let status = item.RealEnrollmentStatus;

		status = status && (forCredit.test(status) ? FOR_CREDIT : OPEN);

		for(let opt of item.getEnrollmentOptions()) {
			dropable = dropable || dropableMime.test(opt.MimeType);
			available = available || Boolean(opt.available);
			enrolled = enrolled || Boolean(opt.enrolled);
		}

		return {enrolled, dropable, available, status};
	},


	button () {
		let status = this.getStatus();
		let {available, enrolled, dropable} = status || {};

		return (!available && !enrolled) || (!dropable && enrolled) ? null :
			enrolled ?
				<a className="action drop" href={this.getDropHref()}>Drop</a> :
				<a className="action add" href={this.getAddHref()}>Add</a>
			;
	}
});
