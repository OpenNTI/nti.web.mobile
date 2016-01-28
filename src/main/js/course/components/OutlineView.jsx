import React from 'react';
import cx from 'classnames';

import Logger from 'nti-util-logger';

import ActiveState from 'common/components/ActiveState';
import Banner from 'common/components/Banner';
import CalendarCard from 'common/components/CalendarCard';
import E from 'common/components/Ellipsed';
import Header from 'common/components/TopicHeader';

import ContextSender from 'common/mixins/ContextSender';
//import NavigationAware from 'common/mixins/NavigationAware';
import Loading from 'common/components/Loading';

import isEmpty from 'isempty';
import CourseLinker from 'library/mixins/CourseContentLink';
import {LESSONS} from '../Sections';

const logger = Logger.get('course:components:OutlineView');

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
			logger.error('There was an error resolving the outline: %o', error);
			this.setState({
				depthMap,
				loading: false,
				outline: {},
				prefix
			});
		});
	},


	render () {
		const {props: {className, item}, state: {outline, loading}} = this;

		if (loading) {
			return (<Loading/>);
		}

		return (
			<div className={cx('outline-view', className)}>
				<Banner item={item} className="head">
					<div className="branding"/>
				</Banner>

				{this.props.children}

				<Header>Outline</Header>
				<ul className="outline">
					<li>{this.renderTree(outline.contents)}</li>
				</ul>
			</div>
		);
	},


	renderTree (list) {
		let renderTree = this.renderTree;
		let {depthMap} = this.state;

		if (isEmpty(list)) {
			return null;
		}

		return React.createElement('ul', {}, ...list.map(item => {
			const {ref: link, depth, title} = item;
			const tag = depthMap[depth - 1] || 'div';
			const date = item.getAvailableBeginning();
			const href = link ? (link + '/') : null;

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
