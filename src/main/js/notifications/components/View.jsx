/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Store = require('../Store');
var Actions = require('../Actions');


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
        var meta = Store.getData().metaData;
		if(/*some cond to check...*/ true) {
        	Actions.load();
        }
    },


    _onChange: function() {
		this.setState({notifications: Store.getData()});
	},


	render: function() {
		return (
	      <div>
			Item
	      </div>
	    );
	}
});
