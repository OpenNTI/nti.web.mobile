import React from 'react';

import ActiveState from 'common/components/ActiveState';
import Loading from 'common/components/LoadingInline';

import isEmpty from 'dataserverinterface/utils/isempty';
import CourseLinker from 'library/components/CourseContentLinkMixin';
//import BasePathAware from 'common/mixins/BasePath';
import SetStateSafely from 'common/mixins/SetStateSafely';

export default React.createClass({
	displayName: 'CourseOutlineView',
	mixins: [SetStateSafely, CourseLinker],

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	getDefaultProps () {
		return {
			className: 'course-outline'
		};
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

		resolvingOutline.then(outline => {

			if (outline && outline.maxDepth > 2) {
				depthMap.splice(1, 0, 'h3');
			}

			this.setStateSafely({
				depthMap,
				loading: false,
				outline,
				prefix
			});
		});
	},


	render () {
		let {outline, loading, icon, label, title} = this.state;

		if (loading) {
			return (<Loading/>);
		}

		return (
			<div className={this.props.className}>
				<div className="head">
					<img src={icon}/>
					<label>
						<h3>{title}</h3>
						<h5>{label}</h5>
					</label>
					<div className="branding"/>
				</div>

				{this.props.children}

				<ul className="outline">
					<li><label>Outline</label></li>
					<li>{this.renderTree(outline.contents)}</li>
				</ul>
			</div>
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
