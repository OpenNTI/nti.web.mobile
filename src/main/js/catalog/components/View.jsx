/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var DefaultRoute = Router.NotFound;

var Loading = require('common/components/Loading');
var Link = require('common/components/controls/link/HighlightedLink');

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
			<Locations contextual>
				<DefaultRoute handler={Collection} title="Catalog" list={catalog}/>
				<Location path="/:entryId" handler={Detail}/>
			</Locations>
	    );
	}
});
