/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Store = require('../Store');
var Actions = require('../Actions');

var Collection = require('./Collection');
var Filters = require('../Filters');

var Loading = require('common/components/Loading');
var EmptyList = require('common/components/EmptyList');

var List = React.createClass({

	propTypes: {
		basePath: React.PropTypes.string.isRequired
	},

	getInitialState: function() {
		//FIXME: Re-write this:
		// See: http://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
		// Additional Node: On Mount and Recieve Props fill state (this is ment to be called one per CLASS lifetime not Instance lifetime)
        return { library: Store.getData() };
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

    _onChange: function() {
		this.setState({library: Store.getData()});
	},

	_itemListForSection: function(section) {
		var library = this.state.library;
		switch (section) {
			case 'courses':
				return [].concat(library.courses || []);

			case 'books':
				return [].concat(library.bundles || [], library.packages || []);

			case 'instructing':
				return [].concat(library.coursesAdmin || []);

			default:
				console.error('Unknown section; returning empty array.');
				return [];
		}
	},

	_filtersForSection: function(section) {
		return section === 'courses' ? Filters : null;
	},

	render: function() {

		if(!this.state.library.loaded) {
			return <Loading />;
		}

		var list = this._itemListForSection(this.props.section);
		var filters = this._filtersForSection(this.props.section);

		if (list.length === 0) {
			return (<EmptyList />);
		}

		return this.transferPropsTo(
			<Collection list={list} filters={filters} defaultFilter='Current' />
		);
	}

});

module.exports = List;
