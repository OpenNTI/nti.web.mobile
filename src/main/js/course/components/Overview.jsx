import {decodeFromURI} from 'dataserverinterface/utils/ntiids';
import React from 'react';

import DateTime from 'common/components/DateTime';

import Loading from 'common/components/Loading';
import ErrorWidget from 'common/components/Error';

import SetStateSafely from 'common/mixins/SetStateSafely';
import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import AnalyticsStore from 'analytics/Store';

// This is an example of the correct way to aquire a reference to
// this mixin from outside of the `widgets` package. If this comment
// strikes you odd, see the comment block with the `./widgets/Mixin.js`
import {Mixin} from './widgets';

export default React.createClass({
	displayName: 'CourseOverview',
	mixins: [Mixin, NavigatableMixin, SetStateSafely, ContextSender],

	propTypes: {
		course: React.PropTypes.object.isRequired,
		outlineId: React.PropTypes.string.isRequired
	},

	getInitialState () {
		return {
			loading: true,
			error: false,
			data: null
		};
	},


	getContext () {
		let id = this.getOutlineID(this.props);
		let href = this.makeHref(id);

		return Promise.resolve({
			label: 'Lession Overview',
			ntiid: decodeFromURI(id),
			href
		});
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
					this.setStateSafely({
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
		console.error(error);
		this.setStateSafely({
			error,
			loading: false,
			data: null
		});
	},


	getDataIfNeeded (props) {
		this.setStateSafely(this.getInitialState());
		try {

			props.course.getOutlineNode(this.getOutlineID(props))
				.then(this.getOutlineNodeContents)
				.catch(this.onError);

		}
		catch (e) {
			this.onError(e);
		}
	},


	getOutlineID  (props) {
		return decodeFromURI((props||this.props).outlineId);
	},


	render () {
		let {data, node, loading, error} = this.state;

		if (loading) { return (<Loading/>); }
		if (error) { return (<ErrorWidget error={error}/>); }

		let title = (data || {}).title;
		let items = (data || {}).Items || [];

		return (
			<div className="course-overview row">
				<DateTime date={node.AvailableBeginning} className="label" format="dddd, MMMM Do"/>
				<h1 dangerouslySetInnerHTML={{__html: title}}/>
				{this._renderItems(items, {node: node})}
			</div>
		);
	}
});
