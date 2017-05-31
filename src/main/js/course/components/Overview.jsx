import Logger from 'nti-util-logger';
import {decodeFromURI} from 'nti-lib-ntiids';
import PropTypes from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import {
	DateTime,
	Loading,
	Error as ErrorWidget,
	EmptyList,
	Mixins
} from 'nti-web-commons';

import ContextSender from 'common/mixins/ContextSender';

import {rawContent} from 'nti-commons';

import {addHistory} from 'nti-analytics';

// This is an example of the correct way to aquire a reference to
// this mixin from outside of the `widgets` package. If this comment
// strikes you odd, see the comment block with the `./widgets/Mixin.js`
import {Mixin} from './widgets';

const logger = Logger.get('course:components:Overview');

export default createReactClass({
	displayName: 'CourseOverview',
	mixins: [Mixin, Mixins.NavigatableMixin, ContextSender],

	propTypes: {
		course: PropTypes.object.isRequired,
		outlineId: PropTypes.string.isRequired
	},

	getInitialState () {
		return {
			assignments: null,
			loading: true,
			error: false,
			data: null
		};
	},


	getContext () {
		let {outlineId, course} = this.props;
		let href = this.makeHref(outlineId);
		let id = this.getOutlineID();

		return course.getOutlineNode(id)
			.then(node=>({
				label: node.title,
				ntiid: id,
				ref: node.ref,
				scope: node,//for UGD
				href
			}),
			//error
			() => {
				logger.warn('Could not find outline node: %s in course: %s', id, course.getID());
			});
	},


	componentDidMount () {
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount () {
		addHistory(this.getOutlineID(this.props));
	},


	componentWillReceiveProps (nextProps) {
		if (nextProps.outlineId !== this.props.outlineId) {
			this.getDataIfNeeded(nextProps);
		}
	},


	getOutlineNodeContents (node) {
		try {
			let currentPage = this.getOutlineID();
			let pages = node.getPageSource();

			this.setPageSource(pages, currentPage);

			node.getContent()
				.then(data=>
					this.setState({
						node, data,
						loading: false,
						error: false
					})
				)
				.catch(this.onError);
		} catch (e) {
			this.onError(e);
		}
	},


	onError (error) {
		logger.error('Error loading Overview: ', error.stack || error.message || error);

		this.setState({
			error,
			loading: false,
			data: null
		});

	},


	getDataIfNeeded (props) {
		const {course} = props;
		this.setState(this.getInitialState());
		try {
			Promise.all([
				course.getOutlineNode(this.getOutlineID(props)),
				course.getAssignments().catch(()=> null)
			])
				.then(results => {
					let [node, assignments] = results;
					this.setState({assignments});
					return node;
				})

				.then(this.getOutlineNodeContents)
				.catch(this.onError);

		}
		catch (e) {
			this.onError(e);
		}
	},


	getOutlineID  (props) {
		return decodeFromURI((props || this.props).outlineId);
	},


	render () {
		let {data, node, loading, error} = this.state;

		if (loading) { return (<Loading.Mask />); }
		if (error) { return (<ErrorWidget error={error}/>); }

		let title = (data || {}).title || '';
		let items = (data || {}).Items;

		try {
			return (
				<div className="course-overview row">
					<DateTime date={node.AvailableBeginning} className="label" format="dddd, MMMM Do"/>
					<h1 {...rawContent(title)}/>
					{items && this.renderItems(items, {node})}
				</div>
			);
		} catch (e) {
			if (e.message !== 'No Items to render') {
				return (<ErrorWidget error={e}/>);
			}
		}

		return (
			<EmptyList type="lesson-overview"/>
		);
	}
});
