/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var _t = require('common/locale').scoped('ASSESSMENT');


var Store = require('../Store');


module.exports = React.createClass({
	displayName: 'SetSubmission',

	propTypes: {
		/**
		 * The QuestionSet or Assignment to be submitted.
		 *
		 * @type {QuestionSet/Assignment}
		 */
		assessment: React.PropTypes.object.isRequired
	},


	componentDidMount: function() {
		Store.addChangeListener(this.onChange);
	},


	componentWillUnmount: function() {
		Store.removeChangeListener(this.onChange);
	},


	onChange: function () {
		this.forceUpate();
	},


	onReset: function (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
	},


	onSubmit: function (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
	},


	render: function() {
		var assessment = this.props.assessment;
		var unanswered = Store.countUnansweredQuestions(assessment);
		var disabled = !!unanswered;
		var status = unanswered ? 'incomplete' : 'complete';

		return (
			<div className={'set-submission ' + status}>
				<a href={disabled?'#':null} className={'button ' + (disabled?'disabled':'')} onClick={this.onSubmit}>{_t('submit')}</a>
				<a href="#" className="reset button link" onClick={this.onReset}>{_t('reset')}</a>
				<span className="status-line">{_t('x_unanswered', { count: unanswered  })}</span>
			</div>
		);
	}
});
