/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Store = require('../Store');
var Detail = require('./Detail.jsx');
var Loading = require('common/components/Loading');
var EnrollButtons = require('./EnrollButtons');
var NTIID = require('dataserverinterface/utils/ntiids');

var CatalogEntryDetail = React.createClass({

	propTypes: {
		entryId: React.PropTypes.string,
		entry: React.PropTypes.object,
	},

	getInitialState: function() {
		return {
			loading: true
		};
	},


	componentDidMount: function() {
		Store.addChangeListener(this._onChange);
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},


	componentWillReceiveProps: function(nextProps) {
		if (nextProps.entryId !== this.props.entryId || nextProps.entry !== this.props.entry) {
			this.getDataIfNeeded(nextProps);
		}
	},


	getDataIfNeeded: function(props) {
		var entryId = NTIID.decodeFromURI(props.entryId);
		var entry = props.entry || Store.getEntry(entryId);

		this.setState({
			loading: !entry,
			entry: entry
		});
	},


	_onChange: function() {
		this.getDataIfNeeded(this.props);
	},


	render: function() {

		if (this.state.loading) {
			return <Loading />;
		}

		return (
			<div>
				{this.transferPropsTo(
					<Detail entry={this.state.entry}/>
				)}
				<EnrollButtons catalogEntry={this.state.entry} />
			</div>
		);
	}

});

module.exports = CatalogEntryDetail;
