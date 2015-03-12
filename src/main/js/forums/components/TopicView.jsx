'use strict';

import React from 'react';

import Store from '../Store';
import Api from '../Api';
import {OBJECT_CONTENTS_CHANGED} from '../Constants';
import NTIID from 'dataserverinterface/utils/ntiids';
import Router from 'react-router-component';
let {Location} = Router;

import Topic from './Topic';
import Post from './Post';
import Breadcrumb from 'common/components/Breadcrumb';
import Loading from 'common/components/Loading';
import Err from 'common/components/Error';

// mixins
import StoreEvents from 'common/mixins/StoreEvents';
import ResourceLoaded from 'analytics/mixins/ResourceLoaded';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import KeepItemInState from '../mixins/KeepItemInState';
import ToggleState from '../mixins/ToggleState';
import ContextSender from 'common/mixins/ContextSender';

module.exports = React.createClass({
	displayName: 'TopicView',

	mixins: [
		StoreEvents,
		ResourceLoaded,
		NavigatableMixin,
		KeepItemInState,
		ToggleState,
		ContextSender
	],

	backingStore: Store,
	backingStoreEventHandlers: {
		[OBJECT_CONTENTS_CHANGED]: function(event) {
			if (event.objectId === this.props.topicId) {
				this.setState({
					loading: false
				});
			}
		}
	},

	getInitialState: function() {
		return {
			loading: true,
			deleted: false
		};
	},

	componentDidMount: function() {
		var {topicId} = this.props;
		this._loadData(topicId);
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.topicId !== this.props.topicId) {
			this._loadData(nextProps.topicId);
		}
	},

	_topicId(props=this.props) {
		return NTIID.decodeFromURI(props.topicId);
	},

	_loadData: function(topicId=this.props.topicId) {
		Api.getTopicContents(topicId)
		.then(
			result => {
				Store.setObject(topicId, result.object);
				Store.setObjectContents(topicId, result.contents);
				this.setState({
					item: result.object
				});
			},
			reason => {
				this.setState({
					error: reason
				});
			}
		);
	},

	// title bar back arrow
	getContext () {
		let topic = this._topic();
		let href = this.makeHref('/' + this.props.topicId + '/');
		let label = topic && topic.headline ? topic.headline.title : 'Topic';

		return Promise.resolve({
			label,
			href
		});

	},

	// breadcrumb
	__getContext: function() {
		let getContextProvider = this.props.contextProvider || Breadcrumb.noContextProvider;
		let href = this.makeHref('/' + this.props.topicId + '/');
		let topic = this._topic();
		let topicId = this._getPropId();
		let title = topic && topic.headline ? topic.headline.title : 'Topic';
		return getContextProvider().then(context => {
			context.push({
				ntiid: topicId,
				label: title,
				href: href
			});
			return context;
		});
	},

	_topic: function() {
		return this._item()||Store.getObject(this.props.topicId);
	},

	_getPropId: function() {
		return this.props.topicId;
	},

	render: function() {

		if (this.state.error) {
			return <Err error={this.state.error} />;
		}

		if (this.state.loading) {
			return <Loading />;
		}

		let topic = this._topic();

		return (
			<Router.Locations contextual>
				<Location path="/(#nav)"
					handler={Topic}
					topic={topic}
					{...this.props}
					contextProvider={this.__getContext}
				/>
				<Location path="/:postId/(#nav)"
					handler={Post}
					topic={topic}
					{...this.props}
					contextProvider={this.__getContext}
				/>
			</Router.Locations>
		);
	}

});
