import path from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import {addHistory} from 'nti-analytics';
import Logger from 'nti-util-logger';
import {decodeFromURI, encodeForURI, isNTIID} from 'nti-lib-ntiids';
import {Overview} from 'nti-web-course';
import {
	Loading,
	Error as ErrorWidget,
	EmptyList,
} from 'nti-web-commons';

import {Component as ContextSender} from 'common/mixins/ContextSender';

const logger = Logger.get('course:components:Overview');


export default class CourseLessonOverview extends React.Component {

	static propTypes = {
		course: PropTypes.object.isRequired,
		outlineId: PropTypes.string.isRequired
	}

	static contextTypes = {
		router: PropTypes.object
	}


	static childContextTypes = {
		router: PropTypes.object
	}


	attachContextProviderRef = x => this.contextProvider = x

	state = {}


	getChildContext () {
		const {router: nav} = this.context;

		return {
			router: {
				...(nav || {}),
				baseroute: nav && nav.makeHref(''),
				getRouteFor: this.getRouteFor,
			}
		};
	}


	getRouteFor = (obj) => {
		const {context: {router}, state: {assignments}} = this;
		const getID = o => o['Target-NTIID'] || (o.getID ? o.getID() : o['NTIID']);
		const getEncodedID = o => encodeForURI(getID(o));
		const {MimeType: type} = obj || {};
		const env = router.getEnvironment();

		let route = '';

		const isLegacyAssignment = () => {
			return assignments
				&& /questionset/i.test(type)
				&& assignments.isAssignment(getID(obj));
		};

		if (/video/i.test(type)) {
			route = path.join('..', 'videos', getEncodedID(obj));
		}
		else if (/assignment/i.test(type) || isLegacyAssignment()) {
			route = path.join('..', 'assignments', getEncodedID(obj));
		}
		else if (/survey/i.test(type)) {
			route = path.join('content', getEncodedID(obj));
		}
		else if (/questionset/i.test(type)) {
			route = path.join(env.getPath(), 'content', getEncodedID(obj));
		}
		else if (/forum/i.test(type)) {
			route = path.join('..', 'discussions', encodeForURI(obj.ContainerId));
		}
		else if (/topic/i.test(type)) {
			const forumId = encodeForURI(obj.ContainerId);
			route = path.join('..', 'discussions', forumId, getEncodedID(obj));
		}
		else if (/relatedwork/i.test(type)) {
			route = isNTIID(obj.href) ? path.join(env.getPath(), 'content', encodeForURI(obj.href)) : obj.href;
		}
		else {
			console.log(type || obj);//eslint-disable-line
		}

		return route;
	}


	componentDidCatch () {}


	componentDidMount () {
		this.getDataIfNeeded(this.props);
	}


	componentWillUnmount () {
		addHistory(decodeFromURI(this.props.outlineId));
	}


	componentWillReceiveProps (nextProps) {
		if (nextProps.outlineId !== this.props.outlineId) {
			this.getDataIfNeeded(nextProps);
		}
	}


	componentDidUpdate (prevProps, prevState) {
		const {
			contextProvider: context,
			props: {outlineId},
			state: {node}
		} = this;

		const id = decodeFromURI(outlineId);

		if (node) {
			context.setPageSource(node.getPageSource(), id);
		}
	}


	onError (error) {
		logger.error('Error loading Overview: ', error.stack || error.message || error);

		this.setState({
			error,
			loading: false,
			data: null
		});

	}


	async getDataIfNeeded ({course, outlineId}) {
		this.setState({loading: true});
		this.task = outlineId;

		try {
			const node = await course.getOutlineNode(decodeFromURI(outlineId));
			if (this.task === outlineId) {
				this.setState({node});
			}

			const overview = await node.getContent();
			const assignments = await course.getAssignments().catch(() => null);
			if (this.task === outlineId) {
				this.setState({overview, assignments});
			}
		}
		catch (e) {
			if (this.task === outlineId) {
				this.onError(e);
			}
		} finally {
			if (this.task === outlineId) {
				this.setState({loading: false});
				delete this.task;
			}
		}
	}


	render () {
		const {
			props: {course},
			state: {node, overview, loading, error}
		} = this;

		const render = () => {

			if (loading) { return (<Loading.Mask />); }
			if (error) { return (<ErrorWidget error={error}/>); }

			try {
				return (
					<Overview.Lesson course={course} outlineNode={node} overview={overview}/>
				);
			} catch (e) {
				if (e.message !== 'No Items to render') {
					return (<ErrorWidget error={e}/>);
				}
			}

			return (
				<EmptyList type="lesson-overview"/>
			);
		};

		return (
			<ContextSender ref={this.attachContextProviderRef} getContext={getContext} node={node} {...this.props}>
				{render()}
			</ContextSender>
		);
	}
}


async function getContext () {
	const context = this; //called in the scope of the context provider.
	const {outlineId, node} = context.props;
	const href = context.makeHref(outlineId);
	const id = decodeFromURI(outlineId);

	return {
		label: node && node.title,
		ntiid: id,
		ref: node && node.ref,
		scope: node,//for UGD
		href
	};
}
