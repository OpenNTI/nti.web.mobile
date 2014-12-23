'use strict';

var React = require('react/addons');
var Loading = require('common/components/Loading');
var InlineLoader = require('common/components/LoadingInline');
var Button = require('common/forms/components/Button');

var Store = require('../Store');
var Actions = require('../Actions');

var getNotificationItem = require('./kinds').select;

var Empty = React.createClass({

	render: function() {
		return (
			<li className="notification-item empty">
				All Caught Up!
			</li>
		);
	}

});




var LoadMore = React.createClass({

	render: function () {
		var store = this.props.store;
		return (
			<div className="text-center button-box">
				{store.isBusy ?
					<InlineLoader/>
				:
					<Button onClick={this.props.onClick}>Load More</Button>
				}
			</div>
		);
	}

});


module.exports = React.createClass({
	displayName: 'NotificationsView',


	getInitialState: function() {
		//FIXME: Re-write this:
		// See: http://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
		// Additional Node: On Mount and Recieve Props fill state (this is ment to be called one per CLASS lifetime not Instance lifetime)
		
        return { notifications: Store.getData() };
    },


    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
        this.getDataIfNeeded(this.props);
    },


    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },


    componentWillReceiveProps: function(nextProps) {
        this.getDataIfNeeded(nextProps);
    },


	getDataIfNeeded: function(/*props*/) {
        if(!Store.getData().loaded) {
        	Actions.load();
        }
    },


	_onLoadMore: function() {
		Actions.loadMore(this.state.notifications);
		this.forceUpdate();
	},


    _onChange: function() {
		var list = Store.getData();
		this.setState({
			length: list.length,
			notifications: list
		});
	},


	render: function() {
		var list = this.state.notifications || {};
		if (!list.map) {
			return <Loading />;
		}

		return (
			<ul className="off-canvas-list">
				<li><label>Notifications</label></li>
				{list.length ? list.map(getNotificationItem) : Empty()}
				{list.hasMore ?
					<LoadMore onClick={this._onLoadMore} store={list}/> : null
				}
			</ul>
	    );
	}
});
