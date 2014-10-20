/**
 * @jsx React.DOM
 */

 'use strict';

var React = require('react/addons');
var Library = require('../../library');
var Store = Library.Store;
var Actions = Library.Actions;

var LibraryCollection = require('../../library/components/Collection');
var CourseFilters = require('../../library/CourseFilters');
var Loading = require('common/components/Loading');
var NoMatches = require('common/components/NoMatches');

// TODO: this duplicates much of the functionality in library/components/View.jsx.
// do we still need the other?
var CourseList = React.createClass({

	getInitialState: function() {
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

    getDataIfNeeded: function(props) {
		if(!Store.getData().loaded) {
        	Actions.loadLibrary();
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
		return section === 'courses' ? CourseFilters : null;
	},

	render: function() {

		if(!this.state.library.loaded) {
			return <Loading />;
		}

		var basePath = this.props.basePath;

		var list = this._itemListForSection(this.props.section);
		var filters = this._filtersForSection(this.props.section);

		if( list.length === 0 ) {
			return (<NoMatches />);
		}

		return this.transferPropsTo(
			<LibraryCollection list={list} filters={filters}  />
		);
	}

});

module.exports = CourseList;
