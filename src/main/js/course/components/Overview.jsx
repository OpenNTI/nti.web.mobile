'use strict';
var NTIID = require('dataserverinterface/utils/ntiids');
var React = require('react/addons');

var DateTime = require('common/components/DateTime');
var Pager = require('common/components/Pager');
var Loading = require('common/components/Loading');
var ErrorWidget = require('common/components/Error');

var Widgets = require('./widgets');

module.exports = React.createClass({
	displayName: 'CourseOverview',
	mixins: [Widgets.Mixin],

	propTypes: {
		course: React.PropTypes.object.isRequired,
		outlineId: React.PropTypes.string.isRequired
	},

	getInitialState: function() {
		return {
			loading: true,
			error: false,
			data: null
		};
	},


	componentDidMount: function() {
		//Store.addChangeListener(this._onChange);
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount: function() {
		//Store.removeChangeListener(this._onChange);
	},


	componentWillReceiveProps: function(nextProps) {
		if (nextProps.outlineId !== this.props.outlineId) {
			this.getDataIfNeeded(nextProps);
		}
	},


	__getOutlineNodeContents: function(node) {
		try {
			node.getContent()
				.then(overviewData=>
					this.setState({
						node: node,
						data: overviewData,
						loading: false,
						error: false
					}))
				.catch(this.__onError);
		} catch (e) {
			this.__onError(e);
		}
	},


	__onError: function(error) {
		this.setState({
			loading: false,
			error: error,
			data: null
		});
	},


	getDataIfNeeded: function(props) {
		this.setState(this.getInitialState());
		try {

			props.course.getOutlineNode(this.getOutlineID(props))
				.then(this.__getOutlineNodeContents)
				.catch(this.__onError);

		} catch (e) {
			this.__onError(e);
		}
	},



	getOutlineID: function (props) {
		return NTIID.decodeFromURI((props||this.props).outlineId);
	},


	render: function() {
		var {data,node, loading, error} = this.state;
		var pages = node && node.getPageSource();
		var currentPage = this.getOutlineID();

		if (loading) { return (<Loading/>); }
		if (error) { return (<ErrorWidget error={error}/>); }

		var title = (data || {}).title;

		return (
			<div className="course-overview row">
				<Pager pageSource={pages} current={currentPage}/>
				<DateTime date={node.AvailableBeginning} className="label" format="dddd, MMMM Do"/>
				<h1 dangerouslySetInnerHTML={{__html: title}}/>
				{this._renderItems(data.Items, {node: node})}
			</div>
		);
	}
});
