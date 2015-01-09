/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

var Store = require('../../Store');
var Api = require('../../Api');
var Constants = require('../../Constants');

var List = require('../List');
var NTIID = require('dataserverinterface/utils/ntiids');
var Loading = require('common/components/Loading');
var UpLink = require('../NavUp');

module.exports = React.createClass({

	getInitialState: function() {
		return {
			loading: true
		};
	},

	componentDidMount: function() {
		Store.addChangeListener(this._storeChanged);
		this._loadData(this.props.boardId);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChanged);
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.boardId !== this.props.boardId) {
			this._loadData(nextProps.boardId);
		}
	},

	_storeChanged: function(event) {
		switch(event.type) {
			case Constants.OBJECT_CONTENTS_LOADED:
				var oid = NTIID.encodeForURI(event.object.getID());
				if (oid === this.props.boardId) {
					this.setState({
						loading: false,
						board: event.object,
						contents: event.contents
					});
				}
				break;
		}
	},

	_loadData() {
		Api.getObjectContents(this.props.boardId);
	},

	render: function() {

		if (this.state.loading) {
			return <div>(Board.jsx)<Loading /></div>;
		}

		var container = this.state.contents;

		return (
			<nav className="forum">
				<UpLink />
				<List container={container} className="forum-topics" />
			</nav>
		);
	}

});
