import React from 'react';

import Container from './Container';
import SectionMixin from '../../mixins/SectionAware';

const isOpen = RegExp.prototype.test.bind(/open/i);

export default React.createClass({
	displayName: 'Courses',
	mixins: [SectionMixin],

	propTypes: {
		admin: React.PropTypes.bool
	},

	render () {
		const {props: {admin}} = this;
		let section = admin ? 'admin' : 'courses';
		let courses = this.getBinnedData(section);

		//The output should be (per Design™):
		// Groups: Current For-Credit, Current Open and Archived. (Upcoming is omitted)
		// Within each group, sort chronologicaly.
		// Join them to gether into one list using this Group Order:
		// 1) Current For-Credit
		// 2) Current Open
		// 3) Archived
		//
		//
		// "getBinnedData" returns bins already in proper order. (bins are in chronological
		// order and their items are in order too)  So, the only thing to do is drop the upcoming bins.
		// Then, split Current into "For-Credit" and "Open" groups.

		courses = courses.filter(o => !o.isUpcoming); //ignore upcoming

		for (let bin of courses) {
			//Current courses were asked to be grouped into "ForCredit" and "Open"
			if (bin.isCurrent) {

				let forCredit = [];
				let open = [];

				//items are already sorted in chronological order...
				for (let course of bin.items) {
					let list = isOpen(course.getStatus()) ? open : forCredit;
					list.push(course);
				}

				bin.items = [...forCredit, ...open];
			}
		}


		let items = courses.reduce((a, o) => a.concat(o.items), []); //join into one list

		return (
			<Container section={section} items={items}/>
		);
	}
});
