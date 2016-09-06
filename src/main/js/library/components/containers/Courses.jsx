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
		const section = admin ? 'admin' : 'courses';
		const allcourses = this.getBinnedData(section);

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

		let courses = allcourses.filter(o => !o.isUpcoming); //ignore upcoming
		//unless thats all there is...
		if (courses.length === 0) {
			courses = allcourses;
		}

		for (let bin of courses) {
			//Current courses were asked to be grouped into "ForCredit" and "Open"
			if (bin.isCurrent && !bin.homeItems) {//skip if we already processed

				const forCredit = [];
				const open = [];

				//sort items into reverse chronological order (put newest on the front)...
				const sorted = bin.items.slice().sort((a,b) => b.getCreatedTime() - a.getCreatedTime());
				for (let course of sorted) {
					const list = isOpen(course.getStatus()) ? open : forCredit;
					list.push(course);
				}

				//do not mutate the original "items" key.
				bin.homeItems = [...forCredit, ...open];
			}
		}


		const items = courses.reduce((a, o) => a.concat(o.homeItems || o.items), []); //join into one list

		return (
			<Container section={section} items={items}/>
		);
	}
});
