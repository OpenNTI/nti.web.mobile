/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Store = require('../LibraryStore');
var Actions = require('../LibraryActions');

var Package = require('./Package');

module.exports = React.createClass({

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
        var meta = Store.getData().metaData;
		if(/*some cond to check...*/ true) {
        	Actions.loadLibrary();
        }
    },


    _onChange: function() {
		this.setState({library: Store.getData()});
	},


	render: function() {
		var results = (this.state.library || {}).packages || [];
	    return (
	      <div>
			<h2>Books:</h2>
	        {results.map(function(pkg) {
				return <Package key={pkg.NTIID} contentPackage={pkg} />;
	        })}
	      </div>
	    );
	}
});
