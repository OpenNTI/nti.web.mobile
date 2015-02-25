import {decodeFromURI} from 'dataserverinterface/utils/ntiids';
import React from 'react';

import DateTime from 'common/components/DateTime';
import Pager from 'common/components/Pager';
import Loading from 'common/components/Loading';
import ErrorWidget from 'common/components/Error';
import AnalyticsStore from 'analytics/Store';

import OutlineView from './OutlineView';
import MasterDetail from 'navigation/components/MasterDetail';

// This is an example of the correct way to aquire a reference to
// this mixin from outside of the `widgets` package. If this comment
// strikes you odd, see the comment block with the `./widgets/Mixin.js`
import {Mixin} from './widgets';

export default React.createClass({
	displayName: 'CourseOverview',
	mixins: [Mixin],

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
		console.error(error);
		if (this.isMounted()) {
			this.setState({
				error,
				loading: false,
				data: null
			});
		}
	},


	getDataIfNeeded (props) {
		this.setState(this.getInitialState());
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
		let {course} = this.props;
		let pages = node && node.getPageSource();
		let currentPage = this.getOutlineID();

		if (loading) { return (<Loading/>); }
		if (error) { return (<ErrorWidget error={error}/>); }

		let title = (data || {}).title;
		let items = (data || {}).Items || [];

		return (
			<MasterDetail>
				<OutlineView item={course}/>
				<div className="course-overview row">
					<Pager pageSource={pages} current={currentPage}/>
					<DateTime date={node.AvailableBeginning} className="label" format="dddd, MMMM Do"/>
					<h1 dangerouslySetInnerHTML={{__html: title}}/>
					{this._renderItems(items, {node: node})}
				</div>
			</MasterDetail>
		);
	}
});
