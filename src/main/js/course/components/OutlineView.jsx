import './OutlineView.scss';
import path from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import cx from 'classnames';

import { isEmpty } from '@nti/lib-commons';
import Logger from '@nti/util-logger';
import {
	ActiveState,
	ActiveStateContainer,
	Banner,
	Ellipsed,
	CalendarCard,
	Loading,
} from '@nti/web-commons';
import { Router } from '@nti/web-routing';
import { Overview } from '@nti/web-course';
import ContextSender from 'internal/common/mixins/ContextSender';
//import NavigationAware from 'internal/common/mixins/NavigationAware';
import CourseLinker from 'internal/library/mixins/CourseContentLink';

import { LESSONS } from '../Sections';

import Items from './items';

const logger = Logger.get('course:components:OutlineView');

const { Outline } = Overview;

const getOutlineNode = x => x.parent('isOutlineNode');

export default createReactClass({
	displayName: 'CourseOutlineView',
	mixins: [
		ContextSender,
		// NavigationAware,
		CourseLinker,
	],

	propTypes: {
		children: PropTypes.any,
		className: PropTypes.string,
		item: PropTypes.object.isRequired,
	},

	contextTypes: {
		router: PropTypes.object,
	},

	getDefaultProps() {
		return {
			className: 'course-outline',
		};
	},

	getInitialState() {
		return { loading: true };
	},

	componentDidMount() {
		this.fillIn(this.props);
	},

	componentDidUpdate(prevProps) {
		let { item } = this.props;
		if (prevProps.item !== item) {
			this.fillIn(this.props);
		}
	},

	getRemainingItemsRoute(obj, context) {
		const {
			context: { router },
		} = this;
		const env = router.getEnvironment();

		const outlineNode = getOutlineNode(obj);

		return (
			path.join(
				env.getPath(),
				Items.getFullRoute(
					{ NTIID: outlineNode?.ContentNTIID ?? outlineNode?.NTIID },
					obj,
					context
				)
			) + '/'
		);
	},

	fillIn(props) {
		this.setState({ loading: true });
		let { item } = props;
		let resolvingOutline = item
			? item.getOutline({ force: true })
			: Promise.reject();

		let depthMap = ['h1', 'div'];

		let prefix = this.courseHref(item.getID(), LESSONS);

		resolvingOutline.then(
			outline => {
				if (outline && outline.maxDepth > 2) {
					depthMap.splice(1, 0, 'h3');
				}

				this.setState({
					depthMap,
					loading: false,
					outline,
					prefix,
				});
			},
			error => {
				logger.error(
					'There was an error resolving the outline: %o',
					error
				);
				this.setState({
					depthMap,
					loading: false,
					outline: {},
					prefix,
				});
			}
		);
	},

	render() {
		const {
			props: { className, item },
			state: { outline, loading },
		} = this;

		if (loading) {
			return <Loading.Mask />;
		}

		return (
			<div className={cx('outline-view', className)}>
				<Banner item={item} className="head">
					<div className="branding" />
				</Banner>

				{this.props.children}

				<Router.RouteForProvider
					getRouteFor={this.getRemainingItemsRoute}
				>
					<Outline.Header course={item} active />
				</Router.RouteForProvider>

				<ActiveStateContainer>
					<ul className="outline">
						<li>{this.renderTree(outline.contents)}</li>
					</ul>
				</ActiveStateContainer>
			</div>
		);
	},

	renderTree(list) {
		let renderTree = this.renderTree;
		let { depthMap } = this.state;

		if (isEmpty(list)) {
			return null;
		}

		return React.createElement(
			'ul',
			{},
			...list.map(item => {
				const { ref: link, depth, title } = item;
				const tag = depthMap[depth - 1] || 'div';
				const date = item.getAvailableBeginning();
				const href = link ? link + '/' : null;

				const props = {
					href,
					title,
					children: title,
				};

				return (
					<li key={item.ntiid}>
						<ActiveState hasChildren href={href} tag={tag}>
							<CalendarCard date={date} />
							<Ellipsed tag="a" {...props} />
						</ActiveState>
						{renderTree(item.contents)}
					</li>
				);
			})
		);
	},
});
