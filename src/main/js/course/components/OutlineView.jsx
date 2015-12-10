import React from 'react';

import ActiveState from 'common/components/ActiveState';
import E from 'common/components/Ellipsed';
import Banner from 'common/components/Banner';
import DateTime from 'common/components/DateTime';

import ContextSender from 'common/mixins/ContextSender';
//import NavigationAware from 'common/mixins/NavigationAware';
import Loading from 'common/components/Loading';

import isEmpty from 'fbjs/lib/isEmpty';
import CourseLinker from 'library/mixins/CourseContentLink';
import {LESSONS} from '../Sections';

function CalendarCard (props) {
	const {date} = props;

	return !date ? (
		<div/>
	) : (
		<div className="calendar-card">
			<DateTime date={date} className="month" format="MMM"/>
			<DateTime date={date} className="day" format="DD"/>
		</div>
	);
}


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
		this.fillIn(this.props);
	},


	componentWillReceiveProps (nextProps) {
		let {item} = this.props;
		if (nextProps.item !== item) {
			this.fillIn(nextProps);
		}
	},


	fillIn (props) {
		this.setState({loading: true});
		let {item} = props;
		let resolvingOutline = item ? item.getOutline() : Promise.reject();

		let depthMap = ['h1', 'div'];

		let prefix = this.courseHref(item.getID(), LESSONS);

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
		const {props: {item}, state: {outline, loading}} = this;

		if (loading) {
			return (<Loading/>);
		}

		return (
			<div className={this.props.className}>
				<Banner item={item} className="head">
					<div className="branding"/>
				</Banner>

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
			const {ref: link, depth, title} = item;
			const tag = depthMap[depth - 1] || 'div';
			const date = item.getAvailableBeginning();
			const href = link ? (prefix + link + '/') : null;

			const props = {
				href, title, children: title
			};

			return (
				<li>
					<ActiveState hasChildren href={href} tag={tag}>
						<CalendarCard date={date}/>
						<E tag="a" {...props}/>
					</ActiveState>
					{renderTree(item.contents)}
				</li>
			);
		}));
	}
});
