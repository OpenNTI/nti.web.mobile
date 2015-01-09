/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

var Store = require('../../Store');
var Api = require('../../Api');
var Constants = require('../../Constants');

var List = require('../List');
var Loading = require('common/components/Loading');

module.exports = React.createClass({

	getInitialState() {
		return {
			loading: true
		};
	},

	componentDidMount() {
		Store.addChangeListener(this._storeChanged);
		this.loadData();
	},

	componentWillUnmount() {
		Store.removeChangeListener(this._storeChanged);
	},

	componentWillReceiveProps: function(/*nextProps*/) {
		this.loadData();
	},

	_storeChanged(event) {
		switch(event.type) {
			case Constants.BOARD_CONTENTS_CHANGED:
				if (event.boardId === this.props.boardId) {
					this.setState({
						loading: false
					});	
				}
				break;
		}
	},

	loadData() {
		Api.loadBoardContents(this.props.courseId, this.props.boardId);
	},

	render: function() {

		if (this.state.loading) {
			return <div>(Board.jsx)<Loading /></div>;
		}

		var container = Store.getBoardContents(this.props.courseId, this.props.boardId);

		return (
			<nav className="forum">
				<List container={container} className="forum-topics" />
			</nav>
		);
	}

});
