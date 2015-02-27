import React from 'react';
import CourseLinker from './CourseContentLinkMixin';
import CourseContentLink from './CourseContentLink';

import COURSE_SECTIONS from 'course/Sections';

import ActiveState from 'common/components/ActiveState';
import SetStateSafely from 'common/mixins/SetStateSafely';
import E from 'common/components/Ellipsed';

export default React.createClass({
	displayName: 'Course',
	mixins: [CourseLinker, SetStateSafely],

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {};
	},

	componentDidMount () {
		this.fillIn(this.props); },


	componentWillUnmount () {
		let {item} = this.props;
		if (item) {
			item.removeListener('changed', this.itemChanged);
		}
	},


	componentWillReceiveProps (nextProps) {
		let {item} = this.props;
		if (nextProps.item !== item) {
			if (item) {
				item.removeListener('changed', this.itemChanged);
			}
			this.fillIn(nextProps);
		}
	},


	itemChanged () {
		let {item} = this.props;
		let presentation = item ? item.getPresentationProperties() : {};
		let {icon, title, label, author} = presentation;
		this.setStateSafely({ icon, title, label, author });
	},


	resolveSections (item) {
		let items = [];
		let courseId = item.getCourseID();

		//Activity
		// items.push({
		// 	title: 'Activity',
		// 	// href: this.courseHref(courseId, COURSE_SECTIONS.ACTIVITY),
		// });

		//Lessons
		items.push({
			title: 'Lessons',
			href: this.courseHref(courseId, COURSE_SECTIONS.LESSONS),
			hasChildren: true
		});

		// Assignments
		// items.push({
		// 	title: 'Assignments',
		// 	href: this.courseHref(courseId, COURSE_SECTIONS.ASSIGNMENTS),
		// 	hasChildren: true
		// });

		//Discussions
		items.push({
			title: 'Discussions',
			href: this.courseHref(courseId, COURSE_SECTIONS.DISCUSSIONS),
			hasChildren: true
		});

		// items.push({
		// 	title: 'Videos',
		// 	href: this.courseHref(courseId, COURSE_SECTIONS.VIDEOS),
		// 	hasChildren: true
		// });

		//Course Info
		items.push({
			title: 'Course Info',
			href: this.courseHref(courseId, COURSE_SECTIONS.INFO),
		});

		return items;
	},


	fillIn (props) {
		this.itemChanged();

		let {item} = props;
		if (item) {
			item.addListener('changed', this.itemChanged);
		}

		let sections = item ? this.resolveSections(item) : [];

		this.setStateSafely({
			sections
		});
	},


	render () {
		var {item} = this.props;
		var {icon, title, label, author} = this.state;
		var courseId = item.getCourseID();

		return (
			<div className="library-item course">
				<CourseContentLink courseId={courseId} section={COURSE_SECTIONS.LESSONS}>
					<img src={icon}/>
					<label>
						<h5>{label}</h5>
						<E tag="h3">{title}</E>
						<E tag="address" className="author" measureOverflow="parent">{'By '+author}</E>
					</label>
				</CourseContentLink>

				{this.renderSectionItems()}
			</div>
		);
	},


	renderSectionItems () {
		let {sections} = this.state;
		if (!sections) {return;}

		return (
			<ul className="sections">
			{sections.map(x=>
				<li key={x.title}>
					<ActiveState {...x} tag="div"><a {...x}>{x.title}</a></ActiveState>
				</li>
			)}
			</ul>
		);
	}
});
