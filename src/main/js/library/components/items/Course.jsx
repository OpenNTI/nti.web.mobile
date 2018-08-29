import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Ellipsed, Presentation} from '@nti/web-commons';

import * as COURSE_SECTIONS from 'course/Sections';
import getLabel from 'course/get-section-label';

import CourseLinker from '../../mixins/CourseContentLink';
import CourseContentLink from '../CourseContentLink';
import Badge from '../Badge';

const isScorm = x => /scorm/i.test(x.getLinkProperty('CourseInstance', 'type'));

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


	componentDidUpdate ({item}) {
		if (this.props.item !== item) {
			if (item) {
				item.removeListener('change', this.itemChanged);
			}
			this.fillIn(this.props);
		}
	},


	itemChanged () {
		let {item} = this.props;
		let presentation = item ? item.getPresentationProperties() : {};
		let {title, label, author} = presentation;

		this.setState({ title, label, author });
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

			if (isScorm(item)) {
				items.push({
					title: getLabel('scormcontent'),
					href: this.courseHref(courseId, COURSE_SECTIONS.SCORMCONTENT)
				});
			} else {
				//Lessons
				items.push({
					title: getLabel('lessons'),
					href: this.courseHref(courseId, COURSE_SECTIONS.LESSONS)
					// hasChildren: true
				});
			}


			// Assignments
			// items.push({
			// 	title: 'Assignments',
			// 	href: this.courseHref(courseId, COURSE_SECTIONS.ASSIGNMENTS),
			// 	hasChildren: true
			// });

			//Discussions
			items.push({
				title: getLabel('discussions'),
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
			title: getLabel('info'),
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
		const {CatalogEntry} = item || {};
		return CatalogEntry && CatalogEntry.Preview;
	},

	getDefaultSection (preview, item) {
		if (preview) {
			return COURSE_SECTIONS.INFO;
		} else if (isScorm(item)) {
			return COURSE_SECTIONS.SCORMCONTENT;
		} else {
			return COURSE_SECTIONS.LESSONS;
		}
	},

	render () {
		let {item} = this.props;
		let {title, label, author} = this.state;
		let courseId = item.getCourseID();
		const preview = this.isPreview(item);
		let defaultSection = this.getDefaultSection(preview, item);

		return (
			<div className="library-item course">
				<CourseContentLink courseId={courseId} section={defaultSection}>
					<Presentation.Asset contentPackage={item.CatalogEntry} propName="src" type="landing">
						<img/>
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
				{sections.map(x=> (
					<li key={x.title}>
						<div {...x}><a {...x} className="with-arrow">{x.title}</a></div>
					</li>
				))}
			</ul>
		);
	}
});
