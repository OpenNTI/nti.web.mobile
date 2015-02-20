import React from 'react';

import ActiveState from 'common/components/ActiveState';
import Loading from 'common/components/LoadingInline';

import isEmpty from 'dataserverinterface/utils/isempty';
import CourseLinker from 'library/components/CourseContentLinkMixin';
//import BasePathAware from 'common/mixins/BasePath';
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


	fillIn (props) {
		this.itemChanged();
		this.setStateSafely({loading: true});
		let {item} = props;
		let resolvingOutline = item ? item.getOutline() : Promise.reject();

		if (item) {
			item.addListener('changed', this.itemChanged);
		}

		let depthMap = ['h1','div'];

		let prefix = this.getBasePath();

		let sections = item ? this.resolveSections(item) : [];

		resolvingOutline.then(outline => {

			if (outline && outline.maxDepth > 2) {
				depthMap.splice(1, 0, 'h3');
			}

			this.setStateSafely({
				depthMap,
				loading: false,
				outline,
				prefix,
				sections
			});
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
			href: `${baseUrl}o/`
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
		let {outline, loading, icon, label, title} = this.state;

		if (loading) {
			return (<Loading/>);
		}

		return (
			<div className="course-nav">
				<div className="head">
					<img src={icon}/>
					<label>
						<h3>{title}</h3>
						<h5>{label}</h5>
					</label>
					<div className="branding"/>
				</div>

				{this.renderSectionItems()}

				<ul className="outline">
					<li><label>Outline</label></li>
					<li>{this.renderTree(outline.contents)}</li>
				</ul>
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
	},


	renderTree (list) {
		let renderTree = this.renderTree;
		let {depthMap, prefix} = this.state;

		if (isEmpty(list)) {
			return null;
		}

		return (
			<ul>
				{list.map(item => {
					var {href, depth, title} = item;

					var tag = depthMap[depth - 1] || 'div';

					if (href) {
						href = prefix + href;
					}

					var props = {
						href, title, children:[title]
					};

					return (
						<li key={href}>
							<ActiveState hasChildren href={href} tag={tag}><a {...props}/></ActiveState>
							{renderTree(item.contents)}
						</li>
					);
				})}
			</ul>
		);

	}
});
