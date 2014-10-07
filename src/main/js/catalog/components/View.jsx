/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Router = require('react-router-component');

var Loading = require('common/components/Loading');

var Store = require('../Store');
var Actions = require('../Actions');

var Collection = require('./Collection');
var Detail = require('./Detail');

module.exports = React.createClass({
	displayName: 'View',

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

		if (!catalog.loaded) {
			return (<Loading/>);
		}

    	return (
			<Router.Locations contextual>
				<Router.Location path="/:entryId/(#:nav)" handler={Detail}/>
				<Router.NotFound handler={Collection} title="Catalog" list={catalog}/>
			</Router.Locations>
	    );
	}
});
