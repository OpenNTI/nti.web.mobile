import React from 'react';

import ActiveState from 'common/components/ActiveState';
import Loading from 'common/components/LoadingInline';

import Outline from 'course/components/OutlineView';
import COURSE_SECTIONS from 'course/Sections';

import SetStateSafely from 'common/mixins/SetStateSafely';
import CourseLinker from 'library/components/CourseContentLinkMixin';

export default React.createClass({
	displayName: 'navigation:type:Course',
	mixins: [SetStateSafely, CourseLinker],

	propTypes: {
		item: React.PropTypes.object.isRequired
	},


	getInitialState () {
		return {loading:true};
	},


	componentDidMount () {
		this.fillIn(this.props);
	},


	componentWillReceiveProps (nextProps) {
		if (nextProps.item !== this.props.item) {
			this.fillIn(nextProps);
		}
	},


	fillIn (props) {
		//this.setStateSafely({loading: true});
		let {item} = props;

		let sections = item ? this.resolveSections(item) : [];

		this.setStateSafely({
			loading: false,
			sections
		});
	},


	resolveSections (item) {
		let items = [];
		let courseId = item.getCourseID();

		//Activity
		// items.push({
		// 	title: 'Activity',
			// href: this.courseHref(courseId, COURSE_SECTIONS.ACTIVITY),
		// });

		//Lessons
		items.push({
			title: 'Lessons',
			href: this.courseHref(courseId, COURSE_SECTIONS.LESSONS),
			hasChildren: true
		});

		//Assignments
		items.push({
			title: 'Assignments',
			// href: this.courseHref(courseId, COURSE_SECTIONS.ASSIGNMENTS),
			hasChildren: true
		});

		//Discussions
		items.push({
			title: 'Discussions',
			href: this.courseHref(courseId, COURSE_SECTIONS.DISCUSSIONS),
			hasChildren: true
		});

		items.push({
			title: 'Videos',
			href: this.courseHref(courseId, COURSE_SECTIONS.VIDEOS),
			hasChildren: true
		});

		//Course Info
		items.push({
			title: 'Course Info',
			href: this.courseHref(courseId, COURSE_SECTIONS.INFO),
		});

		return items;
	},


	render () {
		let {loading} = this.state;

		return (
			<Outline item={this.props.item} className="course-nav">
				{loading? <Loading/> : this.renderSectionItems()}
			</Outline>
		);
	},


	renderSectionItems () {
		let {sections} = this.state;
		if (!sections) {return;}

		return (
			<ul className="sections">{sections.map(x=>
				<li key={x.title}>
					<ActiveState {...x} tag="div"><a {...x}>{x.title}</a></ActiveState>
				</li>
			)}
			</ul>
		);
	}
});
