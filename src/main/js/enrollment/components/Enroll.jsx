/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var CatalogStore = require('../../library/catalog/Store');
var CatalogActions = require('../../library/catalog/Actions');
var NTIID = require('dataserverinterface/utils/ntiids');
var EnrollmentOptions = require('../../library/catalog/mixins/EnrollmentMixin');

var Enroll = React.createClass({

	mixins: [EnrollmentOptions],

	getInitialState: function() {
		return {
			entry: null
		};
	},

	componentDidMount: function() {
		CatalogStore.addChangeListener(this.getDataIfNeeded);
		CatalogActions.loadCatalog();
		this.getDataIfNeeded();
	},

	componentWillUnmount: function() {
		CatalogStore.removeChangeListener(this.getDataIfNeeded);
	},

	getDataIfNeeded: function() {
		var entryId = NTIID.decodeFromURI(this.props.entryId);
		var entry = CatalogStore.getEntry(entryId);
		this.setState({
			entry: entry
		});
	},


	render: function() {

		var options = this._enrollmentOptions(this.state.entry).map(function(item) {
			return <li>enrollment option: {item}</li>;
		});

		return (
			<div>
				enroll {this.props.entryId}
				<ul>{options}</ul>
			</div>			
		);
	}

});

module.exports = Enroll;
