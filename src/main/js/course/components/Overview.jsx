import React from 'react';
import PropTypes from 'prop-types';
import {addHistory} from 'nti-analytics';
import Logger from 'nti-util-logger';
import {decodeFromURI} from 'nti-lib-ntiids';
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
		router: PropTypes.object,
		setRouteViewTitle: PropTypes.func
	}


	state = {}


	attachContextProvider = x => this.contextProvider = x


	getChildContext () {
		return {
			router: {
				...(this.context.router || {}),
				baseroute: '/mobile/catalog/',
				getRouteFor: this.getRouteFor,
				history: {
					push () {},
					replace () {},
					createHref () {

					}
				}
			},
			setRouteViewTitle: () => {}
		};
	}


	getRouteFor = (obj) => {
		console.log(obj);//eslint-disable-line
	}


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
			if (this.task === outlineId) {
				this.setState({overview});
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
			<ContextSender ref={this.attachContextProvider} getContext={getContext} node={node} {...this.props}>
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
