/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

var Api = require('../../Api');
var Store = require('../../Store');
var Constants = require('../../Constants');

var List = require('../List');
var Loading = require('common/components/Loading');
var NTIID = require('dataserverinterface/utils/ntiids');
var NavUp = require('../NavUp');

module.exports = React.createClass({

	getInitialState: function() {
		return {
			loading: true
		};
	},

	componentDidMount: function() {
		Store.addChangeListener(this._storeChanged);
		this._loadData(this.props.forumId);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChanged);
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.forumId !== this.props.forumId) {
			this._loadData(nextProps.forumId);
		}
	},

	_storeChanged: function(event) {
		switch(event.type) {
			case Constants.OBJECT_CONTENTS_LOADED:
				var oid = NTIID.encodeForURI(event.object.getID());
				if (oid === this.props.forumId) {
					this.setState({
						loading: false,
						forum: event.object,
						contents: event.contents
					});
				}
				break;
		}
	},

	_loadData: function(forumId) {
		Api.getObjectContents(forumId);
	},

	render: function() {

		if (this.state.loading) {
			return <Loading />;
		}

		var container = this.state.contents;

		return (
			<nav className="forum">
				<NavUp />
				<List container={container} className="forum-topics" />
			</nav>
		);
	}

});
