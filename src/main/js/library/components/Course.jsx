import React from 'react';
import CourseLinker from './CourseContentLinkMixin';
import CourseContentLink from './CourseContentLink';

import {BLANK_IMAGE} from 'common/constants/DataURIs';
import ActiveState from 'common/components/ActiveState';
import SetStateSafely from 'common/mixins/SetStateSafely';

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
		let {icon, title, label} = presentation;
		this.setStateSafely({ icon, title, label });
	},


	resolveSections (item) {
		let items = [];
		let courseId = item.getCourseID();
		let baseUrl = this.courseHref(courseId, false);

		//Activity
		items.push({
			title: 'Activity',
			// href: `${baseUrl}activity`
		});

		//Lessons
		items.push({
			title: 'Lessons',
			href: `${baseUrl}o/`,
			hasChildren: true
		});

		//Assignments
		items.push({
			title: 'Assignments',
			// href: `${baseUrl}a/`,
			hasChildren: true
		});

		//Discussions
		items.push({
			title: 'Discussions',
			href: `${baseUrl}d/`,
			hasChildren: true
		});

		items.push({
			title: 'Videos',
			href: `${baseUrl}v/`,
			hasChildren: true
		});

		//Course Info
		items.push({
			title: 'Course Info',
			href: baseUrl
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
		var {icon, title, label} = this.state;
		var courseId = item.getCourseID();

		return (
			<li className="grid-item">
				<CourseContentLink courseId={courseId}>
					<img style={{backgroundImage: icon && `url(${icon})`}} src={BLANK_IMAGE}/>
					<label>
						<h3>{title}</h3>
						<h5>{label}</h5>
					</label>
				</CourseContentLink>

				{this.renderSectionItems()}
			</li>
		);
	},


	renderSectionItems () {
		let {sections} = this.state;
		if (!sections) {return;}

		return (
				<ul className="sections small-block-grid-2">{sections.map(x=>
				<li key={x.title}>
					<ActiveState {...x} tag="div"><a {...x}>{x.title}</a></ActiveState>
				</li>
			)}
			</ul>
		);
	}
});
