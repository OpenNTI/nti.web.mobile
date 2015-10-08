import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';
import React from 'react';

import DateTime from 'common/components/DateTime';

import Loading from 'common/components/Loading';
import ErrorWidget from 'common/components/Error';
import EmptyList from 'common/components/EmptyList';

import {IllegalStateException} from 'common/exceptions';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import AnalyticsStore from 'analytics/Store';

// This is an example of the correct way to aquire a reference to
// this mixin from outside of the `widgets` package. If this comment
// strikes you odd, see the comment block with the `./widgets/Mixin.js`
import {Mixin} from './widgets';

export default React.createClass({
	displayName: 'CourseOverview',
	mixins: [Mixin, NavigatableMixin, ContextSender],

	propTypes: {
		course: React.PropTypes.object.isRequired,
		outlineId: React.PropTypes.string.isRequired
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

		return course.getOutlineNode(id).then(node=>({
			label: node.title,
			ntiid: node.getID(),
			ref: node.ref,
			scope: node,//for UGD
			href
		}));
	},


	componentDidMount () {
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount () {
		AnalyticsStore.pushHistory(this.getOutlineID(this.props));
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
					this.isMounted() && this.setState({
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
		console.error('Error loading Overview: ', error.stack || error.message || error);
		if (this.isMounted()) {
			this.setState({
				error,
				loading: false,
				data: null
			});
		}
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

		if (loading) { return (<Loading/>); }
		if (error) { return (<ErrorWidget error={error}/>); }

		let title = (data || {}).title || '';
		let items = (data || {}).Items || [];

		try {
			return (
				<div className="course-overview row">
					<DateTime date={node.AvailableBeginning} className="label" format="dddd, MMMM Do"/>
					<h1 dangerouslySetInnerHTML={{__html: title}}/>
					{this.renderItems(items, {node: node})}
				</div>
			);
		} catch (e) {
			if (!(e instanceof IllegalStateException)) {
				return (<ErrorWidget error={e}/>);
			}
		}

		return (
			<EmptyList type="lesson-overview"/>
		);
	}
});
