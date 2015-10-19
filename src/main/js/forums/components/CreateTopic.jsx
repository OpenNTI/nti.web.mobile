import React from 'react';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import Loading from 'common/components/Loading';
import Notice from 'common/components/Notice';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import Breadcrumb from 'navigation/components/Breadcrumb';

import TopicEditor from './TopicEditor';

import * as Actions from '../Actions';
import {TOPIC_CREATED, TOPIC_CREATION_ERROR} from '../Constants';
import Store from '../Store';

export default React.createClass({
	displayName: 'CreateTopic',
	mixins: [ContextSender, NavigatableMixin],

	propTypes: {
		forum: React.PropTypes.object.isRequired
	},

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
		case TOPIC_CREATED:
			this.setState({
				busy: false
			});
			let topicId = event.topic.getID();
			let path = encodeForURI(topicId);
			this.navigate('/' + path + '/', {replace: true});
			break;

		case TOPIC_CREATION_ERROR:
			this.setState({
				busy: false,
				error: event.data.reason,
				item: event.data.topic
			});
			break;
		}
	},

	canCreateTopic () {
		let {forum} = this.props;
		return !!(forum && forum.hasLink('add'));
	},

	createTopic () {
		let value = this.refs.editor.getValue();
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
			return <Loading />;
		}

		if (!this.canCreateTopic()) {
			return <Notice>Can't create a new topic here.</Notice>;
		}

		return (
			<div>
				<Breadcrumb />
				{this.state.error && <div className="alert-box radius">{this.state.error.message || 'An error occurred.'}</div>}
				<TopicEditor ref="editor" onSubmit={this.createTopic} onCancel={this.onCancel} item={this.state.item} />
			</div>
		);
	}

});
