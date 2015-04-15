import React from 'react';
import Notice from 'common/components/Notice';
import Breadcrumb from 'common/components/Breadcrumb';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import TopicEditor from './TopicEditor';
import Actions from '../Actions';
import Store from '../Store';
import * as Constants from '../Constants';
import Loading from 'common/components/Loading';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

export default React.createClass({
	displayName: 'CreateTopic',

	mixins: [NavigatableMixin],

	propTypes: {
		forum: React.PropTypes.object.isRequired,

		contextProvider: React.PropTypes.func //Deprecated
	},

	getInitialState () {
		return {
			busy: false,
			item: null
		};
	},

	getContext () {
		let getContextProvider = this.props.contextProvider || Breadcrumb.noContextProvider;
		let href = this.makeHref(this.getPath());
		let label = 'New Discussion';
		return getContextProvider().then(context => {
			context.push({
				label: label,
				href: href
			});
			return context;
		});
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
			case Constants.TOPIC_CREATED:
				this.setState({
					busy: false
				});
				let topicId = event.topic.getID();
				let path = encodeForURI(topicId);
				this.navigate('/' + path + '/', {replace: true});
				break;

			case Constants.TOPIC_CREATION_ERROR:
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

	createTopic() {
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
				<Breadcrumb contextProvider={this.getContext} />
				{this.state.error && <div className="alert-box radius">{this.state.error.message || 'An error occurred.'}</div>}
				<TopicEditor ref="editor" onSubmit={this.createTopic} onCancel={this.onCancel} item={this.state.item} />
			</div>
		);
	}

});
