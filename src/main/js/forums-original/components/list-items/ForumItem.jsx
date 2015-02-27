'use strict';

var React = require('react');
var Constants = require('../../Constants');
var LoadingInline = require('common/components/LoadingInline');
var NTIID = require('dataserverinterface/utils/ntiids');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var t = require('common/locale').scoped('FORUMS');

/**
 * For lists of Forums, this is the row item.
 */
module.exports = React.createClass({
	displayName: 'ForumListItem',
	mixins: [
		require('./Mixin'),
		NavigatableMixin,
		require('../../mixins/ToggleState')

	],

	statics: {
		inputType: [
			Constants.types.FORUM
		]
	},

	getInitialState() {
		return {
			loading: true,
			showRecentActivity: false,
			recentActivity: []
		};
	},

	componentDidMount: function() {
		this._load(this.props.item);
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.item !== this.props.item) {
			this._load(nextProps.item);
		}
	},

	_load: function(forum) {
		forum.getRecentActivity()
		.then(topics => {
			this.setState({
				loading: false,
				recentActivity: topics.Items,
				totalItemCount: topics.TotalItemCount
			});
		});
	},

	_href: function() {
		var path = [NTIID.encodeForURI(this.props.item.getID()), ''];
		if (this.props.parentPath) {
			path.unshift(this.props.parentPath);
		}
		return path.join('/');
	},

	_getForumPath: function() {
		return this.getPath().concat(this._href());
	},

	_renderRecentActivity: function() {
		// List component is passed in as a prop to dodge a circular import of List.
		var TopicsComponent = this.props.topicsComponent;
		var {recentActivity} = this.state;
		if (!TopicsComponent || (recentActivity||[]).length === 0) {return null;}

		var headingCss = ['disclosure-triangle'];
		if (this.state.showRecentActivity) {
			headingCss.push('open');
		}
		return (
			<section className="recent-activity">
				<h1 onClick={this._toggleState.bind(this, 'showRecentActivity')} className={headingCss.join(' ')}>
					<a>{t('recentActivity')}</a>
				</h1>
				{this.state.showRecentActivity &&
					<TopicsComponent
						container={{Items:this.state.recentActivity}}
						itemProps={{parentPath: this._getForumPath()}}/>
				}
			</section>
		);
	},

	render: function() {

		if (this.state.loading) {
			return <LoadingInline />;
		}
		var {item} = this.props;
		// var topicCount = t('topicCount', { count: item.TopicCount });
		
		return (
			<div className="forum-item">
				<h3>
					<a className="title" href={this._href()}>
						{item.title}
						<span className="see-all count" href={this._href()}>{t('topicCount', {count: this.state.totalItemCount})}</span>
						<span className="arrow-right"/>
					</a>
				</h3>
				{this._renderRecentActivity()}
			</div>
		);
	}
});
