import React from 'react';
import CourseLinker from '../../mixins/CourseContentLink';
import CourseContentLink from '../CourseContentLink';

import COURSE_SECTIONS from 'course/Sections';

import ActiveState from 'common/components/ActiveState';
import E from 'common/components/Ellipsed';
import Badge from '../Badge';

export default React.createClass({
	displayName: 'Course',
	mixins: [CourseLinker],

	statics: {
		handles (item) {
			return item.isCourse;
		}
	},

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {};
	},

	componentDidMount () {
		this.fillIn(this.props);
	},


	componentWillUnmount () {
		let {item} = this.props;
		if (item) {
			item.removeListener('change', this.itemChanged);
		}
	},


	componentWillReceiveProps (nextProps) {
		let {item} = this.props;
		if (nextProps.item !== item) {
			if (item) {
				item.removeListener('change', this.itemChanged);
			}
			this.fillIn(nextProps);
		}
	},


	itemChanged () {
		let {item} = this.props;
		let presentation = item ? item.getPresentationProperties() : {};
		let {icon, title, label, author} = presentation;
		this.setState({ icon, title, label, author });
	},


	resolveSections (item) {
		let items = [];
		let courseId = item.getCourseID();

		if (!this.isPreview(item)) {

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

		}

		//Course Info
		items.push({
			title: 'Course Info',
			href: this.courseHref(courseId, COURSE_SECTIONS.INFO)
		});

		return items;
	},


	fillIn (props) {
		this.itemChanged();

		let {item} = props;
		if (item) {
			item.addListener('change', this.itemChanged);
		}

		let sections = item ? this.resolveSections(item) : [];

		this.setState({
			sections
		});
	},


	isPreview (item) {
		let {CourseInstance} = item || {};
		let {CatalogEntry} = CourseInstance || {};
		return CatalogEntry && CatalogEntry.Preview;
	},


	render () {
		let {item} = this.props;
		let {icon, title, label, author} = this.state;
		let courseId = item.getCourseID();
		let defaultSection = this.isPreview(item) ? COURSE_SECTIONS.INFO : COURSE_SECTIONS.LESSONS;

		return (
			<div className="library-item course">
				<CourseContentLink courseId={courseId} section={defaultSection}>
					<img src={icon}/>
					<Badge item={item}/>
					<label>
						<h5>{label}</h5>
						<E tag="h3">{title}</E>
						{author && ( <E tag="address" className="author" measureOverflow="parent">{`By ${author}`}</E> )}
					</label>
				</CourseContentLink>

				{this.renderSectionItems()}
			</div>
		);
	},


	renderSectionItems () {
		let {sections} = this.state;
		if (!sections) { return; }

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
