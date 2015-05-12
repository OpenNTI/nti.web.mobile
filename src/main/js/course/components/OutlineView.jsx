import React from 'react';

import ActiveState from 'common/components/ActiveState';
import E from 'common/components/Ellipsed';

import ContextSender from 'common/mixins/ContextSender';
//import NavigationAware from 'common/mixins/NavigationAware';
import Loading from 'common/components/Loading';

import isEmpty from 'nti.lib.interfaces/utils/isempty';
import CourseLinker from 'library/components/CourseContentLinkMixin';


export default React.createClass({
	displayName: 'CourseOutlineView',
	mixins: [
		ContextSender,
		// NavigationAware,
		CourseLinker
	],

	propTypes: {
		children: React.PropTypes.any,
		className: React.PropTypes.string,
		item: React.PropTypes.object.isRequired
	},

	getDefaultProps () {
		return {
			className: 'course-outline'
		};
	},


	getInitialState () {
		return {loading: true};
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
		let {icon, background, title, label} = presentation;
		this.setState({ icon, background, title, label });
	},


	fillIn (props) {
		this.itemChanged();
		this.setState({loading: true});
		let {item} = props;
		let resolvingOutline = item ? item.getOutline() : Promise.reject();

		if (item) {
			item.addListener('changed', this.itemChanged);
		}

		let depthMap = ['h1', 'div'];

		let prefix = this.getBasePath();

		resolvingOutline.then(outline => {

			if (outline && outline.maxDepth > 2) {
				depthMap.splice(1, 0, 'h3');
			}

			this.setState({
				depthMap,
				loading: false,
				outline,
				prefix
			});
		}, error => {
			console.error(error);
			this.setState({
				depthMap,
				loading: false,
				outline: {},
				prefix
			});
		});
	},


	render () {
		let {outline, loading, icon, background, label, title} = this.state;

		if (loading) {
			return (<Loading/>);
		}

		return (
			<div className={this.props.className}>
				<div className="head">
					<img src={background || icon}/>
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

		return React.createElement('ul', {}, ...list.map(item => {
			let {href, depth, title} = item;

			let tag = depthMap[depth - 1] || 'div';

			if (href) {
				href = prefix + href;
			}

			let props = {
				href, title, children: title
			};

			return (
				<li>
					<ActiveState hasChildren href={href} tag={tag}><E tag="a" {...props}/></ActiveState>
					{renderTree(item.contents)}
				</li>
			);
		}));
	}
});
