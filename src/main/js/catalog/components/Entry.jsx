import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { encodeForURI } from '@nti/lib-ntiids';
import { Mixins, Presentation } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

const t = scoped('course.info.catalogEntry', {
	ForCredit: 'For Credit',
	Open: 'Not For Credit',
});

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

export default createReactClass({
	displayName: 'Entry',
	mixins: [Mixins.BasePath, Mixins.ItemChanges],

	propTypes: {
		item: PropTypes.object.isRequired,
	},

	getItem() {
		return this.props.item;
	},

	getDetailHref() {
		let item = this.getItem();
		if (!item) {
			return '';
		}

		let courseId = encodeForURI(item.getID());
		return `${this.getBasePath()}catalog/item/${courseId}/`;
	},

	getAddHref() {
		return `${this.getDetailHref()}enrollment/`;
	},

	getBaseEnrollHref() {
		return `${this.getBasePath()}catalog/enroll/`;
	},

	getDropHref() {
		let item = this.getItem();
		let courseId = encodeForURI(item.getID());
		return `${this.getBaseEnrollHref()}drop/${courseId}/`;
	},

	render() {
		let item = this.getItem();

		if (!item) {
			return;
		}

		let { status } = this.getStatus();

		return (
			<li className="catalog-item">
				<a href={this.getDetailHref()}>
					<Presentation.AssetBackground
						className="thumbnail"
						contentPackage={item}
						type="landing"
					/>
					<label>
						<h3>{item.Title}</h3>
						<div>
							<h5>{item.ProviderUniqueID}</h5>
							{status && (
								<h5>
									{t(
										status === FOR_CREDIT
											? 'ForCredit'
											: 'Open'
									)}
								</h5>
							)}
						</div>
					</label>
				</a>
				{this.button()}
			</li>
		);
	},

	getStatus() {
		let item = this.getItem();
		let enrolled = false;
		let available = false;
		let droppable = false;

		let droppableMime = /openenrollmentoption/i;
		let forCredit = /forcredit/i;

		if (!item) {
			return;
		}

		let status = item.RealEnrollmentStatus;

		status = status && (forCredit.test(status) ? FOR_CREDIT : OPEN);

		for (let opt of item.getEnrollmentOptions()) {
			available = available || Boolean(opt.available);
			enrolled = enrolled || Boolean(opt.enrolled);
			if (opt.enrolled) {
				//only check droppable if we're enrolled in this way.
				droppable = droppable || droppableMime.test(opt.MimeType);
			}
		}

		return { enrolled, droppable, available, status };
	},

	button() {
		let status = this.getStatus();
		let { available, enrolled, droppable } = status || {};

		return (!available && !enrolled) ||
			(!droppable && enrolled) ? null : enrolled ? (
			<a className="action drop" href={this.getDropHref()}>
				Drop
			</a>
		) : (
			<a className="action add" href={this.getAddHref()}>
				Add
			</a>
		);
	},
});
