/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Loading = require('../../common/components/Loading');

var Store = require('../Store');
var Actions = require('../Actions');


var Empty = React.createClass({

	render: function() {
		return (
			<li className="notification-item empty">
				All Caught Up!
			</li>
		);
	}

});


module.exports = React.createClass({

	getInitialState: function() {
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


    getDataIfNeeded: function(props) {
        if(!Store.getData().loaded) {
        	Actions.load();
        }
    },


    _onChange: function() {
		this.setState({notifications: Store.getData()});
	},


	render: function() {
		var list = this.state.notifications || {};

		if (!list.map) {
			return <Loading />;
		}

		return (
	      <ul className="off-canvas-list">
				<li><label>Notifications</label></li>

				{list.length ?
					list.map(function(item) {
						return <li/>;
					}) : <Empty />}
			</ul>
	    );
	}
});
