/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var IconBar = require('./IconBar');
var CourseList = require('./CourseList');
var Collection = require('../../catalog/components/Collection');
var Store = require('../../catalog/Store');
var Actions = require('../../catalog/Actions');


var CatalogView = React.createClass({

	getInitialState: function() {
        return { catalog: Store.getData() };
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
        	Actions.loadCatalog();
        }
    },

    _onChange: function() {
		this.setState({catalog: Store.getData()});
	},

	render: function() {
		var catalog = this.state.catalog;
		return this.transferPropsTo(
			<Collection list={catalog} />
		);
	}

});

module.exports = CatalogView;