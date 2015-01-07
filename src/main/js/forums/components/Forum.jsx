/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

var Store = require('../Store');
var Api = require('../Api');
var Constants = require('../Constants');

var List = require('./List');
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

	componentWillReceiveProps: function(nextProps) {
		this.loadData();	
	},

	_storeChanged(event) {
		switch(event.type) {
			case Constants.FORUM_CONTENTS_CHANGED:
				if (event.forumId === this.props.forumId) {
					this.setState({
						loading: false
					});	
				}
				break;
		}
	},

	loadData() {
		Api.loadForumContents(this.props.course, this.props.forumId);
	},

	render: function() {

		if (this.state.loading) {
			return <Loading />;
		}

		var container = Store.getForumContents(this.props.forumId);

		return (
			<div>
				<List container={container} />
			</div>
		);
	}

});
