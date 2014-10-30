/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Loading = require('common/components/Loading');
var Notice = require('common/components/Notice');

var NTIID = require('dataserverinterface/utils/ntiids');

var Store = require('../Store');

var Title = require('./Title');
var Description = require('./Description');
var Instructors = require('./Instructors');


module.exports = React.createClass({
	displayName: 'Detail',
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
			return (<Loading/>);
		}

		var entry = this.state.entry;
		return (
			<div className="course-detail-view">
				<Title entry={entry} />
				<Description entry={entry} />
				<Instructors entry={entry}/>
				<Notice className="small">Course enrollment is not currently supported on mobile devices.</Notice>
				<div className="footer"/>
			</div>
		);
	}
});
