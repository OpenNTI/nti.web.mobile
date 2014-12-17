/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Store = require('../Store');

var _t = require('common/locale').scoped('ASSESSMENT.ASSIGNMENTS.FEEDBACK');

var FeedbackList = React.DOM.div;
var FeedbackEntry = React.DOM.div;

module.exports = React.createClass({
	displayName: 'Feedback',

	componentDidMount: function() {
		Store.addChangeListener(this.synchronizeFromStore);
		this.synchronizeFromStore();
	},


	componentWillUnmount: function() {
		Store.removeChangeListener(this.synchronizeFromStore);
	},


	componentWillReceiveProps: function(props) {
		this.synchronizeFromStore(props);
	},


	synchronizeFromStore: function() {
		this.forceUpdate();
	},


	render: function() {
		var quiz = this.props.assessment;
		if (!Store.isAssignment(quiz) || !Store.isSubmitted(quiz)) {
			return null;
		}

		return (
			<div className="feedback container">
				<div className="feedback header">
					<h3>{_t('title')}</h3>
					<div className="message">{_t('description')}</div>
				</div>
				<FeedbackList/>
				<FeedbackEntry/>
			</div>
		);
	}
});
