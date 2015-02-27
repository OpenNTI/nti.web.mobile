'use strict';

var React = require('react');
var Notice = require('common/components/Notice');
var Breadcrumb = require('common/components/Breadcrumb');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var TopicEditor = require('./TopicEditor');
var Actions = require('../Actions');
var Store = require('../Store');
var Constants = require('../Constants');
var Loading = require('common/components/Loading');
var NTIID = require('dataserverinterface/utils/ntiids');

var CreateTopic = React.createClass({

	mixins: [NavigatableMixin],

	propTypes: {
		forum: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			busy: false,
			item: null
		};
	},

	__getContext: function() {
		var getContextProvider = this.props.contextProvider || Breadcrumb.noContextProvider;
		var href = this.makeHref(this.getPath());
		var label = 'New Discussion';
		return getContextProvider().then(context => {
			context.push({
				label: label,
				href: href
			});
			return context;
		});
	},

	componentDidMount: function() {
		Store.addChangeListener(this._storeChanged);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChanged);
	},

	_storeChanged: function(event) {
		switch (event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case Constants.TOPIC_CREATED:
				this.setState({
					busy: false
				});
				var topicId = event.topic.getID();
				var path = NTIID.encodeForURI(topicId);
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

	_canCreateTopic() {
		var {forum} = this.props;
		return !!(forum && forum.hasLink('add'));
	},

	_createTopic() {
		var value = this.refs.editor.getValue();
		this.setState({
			busy: true,
			value: value
		});
		var {forum} = this.props;
		Actions.createTopic(forum, value);
	},

	_cancel() {
		this.navigate('/', {replace: true});
	},

	render: function() {

		if (this.state.busy) {
			return <Loading />;
		}

		if (!this._canCreateTopic()) {
			return <Notice>Can't create a new topic here.</Notice>;
		}

		return (
			<div>
				<Breadcrumb contextProvider={this.__getContext} />
				{this.state.error && <div className="alert-box radius">{this.state.error.message||'An error occurred.'}</div>}
				<TopicEditor ref="editor" onSubmit={this._createTopic} onCancel={this._cancel} item={this.state.item} />
			</div>
		);
	}

});

module.exports = CreateTopic;
