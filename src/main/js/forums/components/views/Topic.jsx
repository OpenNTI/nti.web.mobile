/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

var Store = require('../../Store');
var Api = require('../../Api');
var Constants = require('../../Constants');
var NTIID = require('dataserverinterface/utils/ntiids');

var List = require('../List');
var UpLink = require('../NavUp');
var Loading = require('common/components/Loading');

module.exports = React.createClass({

	getInitialState: function() {
		return {
			loading: true
		};
	},

	componentDidMount: function() {
		Store.addChangeListener(this._storeChanged);
		this._loadData(this.props.topicId);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChanged);
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.topicId !== this.props.topicId) {
			this._loadData(nextProps.topicId);
		}
	},

	_storeChanged: function(event) {
		switch(event.type) {
			case Constants.OBJECT_CONTENTS_LOADED:
				var oid = NTIID.encodeForURI(event.object.getID());
				if (oid === this.props.topicId) {
					this.setState({
						loading: false,
						topic: event.object,
						contents: event.contents
					});
				}
				break;
		}
	},

	_loadData: function(topicId) {
		Api.getObjectContents(topicId);
	},

	render: function() {

		if (this.state.loading) {
			return <div>(Topic.jsx)<Loading /></div>;
		}

		var {topic, contents} = this.state;

		return (
			<div>
				<UpLink />
				<h1>{topic.headline.title}</h1>
				<div>{topic.headline.body}</div>
				<List className="forum-replies" container={contents} />
			</div>
		);
	}

});
