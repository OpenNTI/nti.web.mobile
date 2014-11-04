/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Collection = require('./Collection');
var Detail = require('./Detail');
var Store = require('../Store');
var Actions = require('../Actions');

var Loading = require('common/components/Loading');

var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;

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


	getDataIfNeeded: function(/*props*/) {
		if(!Store.getData().loaded) {
        	Actions.loadCatalog();
        }
    },

    _onChange: function() {
		this.setState({catalog: Store.getData()});
	},

	render: function() {

        var catalog = this.state.catalog;
        var basePath = this.props.basePath;

        // console.log('CatalogView.props: %O',this.props);

		if (!catalog.loaded) {
			return (<Loading/>);
		}

        return Locations({contextual: true},
            Location({
                path: '/item/:entryId/(#:nav)',
                handler: Detail,
                basePath: basePath
            }),
            Location({
                path: '*',
                handler: Collection,
                list: catalog,
                basePath: this.props.basePath,
                section: 'catalog'
            })
        );
	}

});

module.exports = CatalogView;
