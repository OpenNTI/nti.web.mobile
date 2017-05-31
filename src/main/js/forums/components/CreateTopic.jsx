import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {encodeForURI} from 'nti-lib-ntiids';
import {Loading, Mixins, Notice} from 'nti-web-commons';

import ContextSender from 'common/mixins/ContextSender';
import Breadcrumb from 'navigation/components/Breadcrumb';

import * as Actions from '../Actions';
import {TOPIC_CREATED, TOPIC_CREATION_ERROR} from '../Constants';
import Store from '../Store';

import TopicEditor from './TopicEditor';

export default createReactClass({
	displayName: 'CreateTopic',
	mixins: [ContextSender, Mixins.NavigatableMixin],

	propTypes: {
		forum: PropTypes.object.isRequired
	},

	attachRef (x) { this.editor = x; },

	getInitialState () {
		return {
			busy: false,
			item: null
		};
	},

	getContext () {
		let href = this.makeHref(this.getPath());
		let label = 'New Discussion';
		return Promise.resolve({label, href});
	},

	componentDidMount () {
		Store.addChangeListener(this.onStoreChanged);
	},

	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChanged);
	},

	onStoreChanged (event) {
		switch (event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
		case TOPIC_CREATED: {
			this.setState({
				busy: false
			});
			let topicId = event.topic.getID();
			let path = encodeForURI(topicId);
			this.navigate('/' + path + '/', {replace: true});
			break;
		}

		case TOPIC_CREATION_ERROR: {
			this.setState({
				busy: false,
				error: event.data.reason,
				item: event.data.topic
			});
			break;
		}
		}
	},

	canCreateTopic () {
		let {forum} = this.props;
		return !!(forum && forum.hasLink('add'));
	},

	createTopic () {
		let value = this.editor.getValue();
		this.setState({
			busy: true,
			value: value
		});
		let {forum} = this.props;
		Actions.createTopic(forum, value);
	},

	onCancel () {
		this.navigate('/', {replace: true});
	},

	render () {

		if (this.state.busy) {
			return <Loading.Mask />;
		}

		if (!this.canCreateTopic()) {
			return <Notice>Can’t create a new topic here.</Notice>;
		}

		return (
			<div>
				<Breadcrumb />
				{this.state.error && <div className="alert-box radius">{this.state.error.message || 'An error occurred.'}</div>}
				<TopicEditor ref={this.attachRef} onSubmit={this.createTopic} onCancel={this.onCancel} item={this.state.item} />
			</div>
		);
	}

});
