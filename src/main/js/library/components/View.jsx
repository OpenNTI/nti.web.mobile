/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var DefaultRoute = Router.NotFound;
var Loading = require('common/components/Loading');

var Store = require('../Store');
var Actions = require('../Actions');

var Collection = require('./Collection');

var CourseFilters = require('../CourseFilters');

module.exports = React.createClass({
	displayName: 'LibraryView',

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
        	Actions.load();
        }
    },

    _onChange: function() {
		this.setState({library: Store.getData()});
	},


	_reroute: function() {
		console.log('default library route/view');
		/*TODO: Pick a view to redirect to...*/
		return React.DOM.div({});
	},


	render: function() {

		if(!this.state.library.loaded) {
			return (<Loading />);
		}

		var library = this.state.library;
		var books = [].concat(library.bundles || [], library.packages || []);
		var courses = [].concat(library.courses || []);
		var instructing = [].concat(library.coursesAdmin || []);

		var basePath = this.props.basePath;

		if (this.props.composite) {
			return (
				<div>
					{courses.length > 0 ? <Collection basePath={basePath} title='Courses' list={courses} /> : null}
					{books.length > 0 ? <Collection basePath={basePath} title='Books' list={books} /> : null}
					{instructing.length > 0 ? <Collection basePath={basePath} title='Administered Courses' list={instructing} /> : null}
				</div>
			);
		}

    	return (
	      <div>
			<Locations contextual>
				<Location path='/books*' handler={Collection} basePath={basePath}
					title='Books' list={books}/>
				<Location path='/courses*' handler={Collection} basePath={basePath}
					title='Courses' list={courses} filters={CourseFilters} />
				<Location path='/admin*' handler={Collection} basePath={basePath}
					title='Administered Courses' list={instructing}/>
				<DefaultRoute handler={this._reroute}/>
			</Locations>
	      </div>
	    );
	}
});
