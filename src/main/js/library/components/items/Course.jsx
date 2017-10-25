import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Ellipsed, Presentation} from 'nti-web-commons';

import * as COURSE_SECTIONS from 'course/Sections';

import CourseLinker from '../../mixins/CourseContentLink';
import CourseContentLink from '../CourseContentLink';
import Badge from '../Badge';

import Icon from './shared/Icon';

export default createReactClass({
	displayName: 'Course',
	mixins: [CourseLinker],

	statics: {
		handles (item) {
			return item.isCourse;
		}
	},

	propTypes: {
		item: PropTypes.object.isRequired
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
				href: this.courseHref(courseId, COURSE_SECTIONS.LESSONS)
				// hasChildren: true
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
				href: this.courseHref(courseId, COURSE_SECTIONS.DISCUSSIONS)
				// hasChildren: true
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
		const preview = this.isPreview(item);
		let defaultSection = preview ? COURSE_SECTIONS.INFO : COURSE_SECTIONS.LESSONS;

		return (
			<div className="library-item course">
				<CourseContentLink courseId={courseId} section={defaultSection}>
					<Presentation.Asset content={item.CourseInstance.CatalogEntry} propName="src" type="landing">
						<Icon src={icon}/>
					</Presentation.Asset>
					<div className="badges">
						{preview && <div className="preview">Preview</div>}
						<Badge item={item}/>
					</div>
					<label>
						<h5>{label}</h5>
						<Ellipsed tag="h3">{title}</Ellipsed>
						{author && ( <Ellipsed tag="address" className="author" measureOverflow="parent">{`By ${author}`}</Ellipsed> )}
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
					(<li key={x.title}>
						<div {...x}><a {...x} className="with-arrow">{x.title}</a></div>
					</li>)
				)}
			</ul>
		);
	}
});
