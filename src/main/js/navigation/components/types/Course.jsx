import React from 'react';

import ActiveState from 'common/components/ActiveState';
import Loading from 'common/components/LoadingInline';

import Outline from 'course/components/OutlineView';
import CourseLinker from 'library/components/CourseContentLinkMixin';
import SetStateSafely from 'common/mixins/SetStateSafely';

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


	render () {
		let {loading} = this.state;

		return (
			<div className="course-nav">
				<Outline item={this.props.item}>
					{loading? <Loading/> : this.renderSectionItems()}
				</Outline>
			</div>
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
