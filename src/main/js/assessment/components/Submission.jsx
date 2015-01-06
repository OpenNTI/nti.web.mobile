'use strict';

var React = require('react/addons');

var _t = require('common/locale').scoped('ASSESSMENT');

var Loading = require('common/components/Loading');

var Store = require('../Store');
var Actions = require('../Actions');
var Constants = require('../Constants');


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
		this.forceUpdate();
	},


	onReset: function (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		Actions.resetAssessment(this.props.assessment);
	},


	onSubmit: function (e) {
		var assessment = this.props.assessment;
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		if (Store.canSubmit(assessment)) {
			Actions.submit(assessment);
		}
	},


	_dismissAssessmentError: function (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		Store.clearError(this.props.assessment);
	},


	render: function() {
		var assessment = this.props.assessment;
		var unanswered = Store.countUnansweredQuestions(assessment);
		var cannotReset = Store.isSubmitted(assessment);
		var disabled = !Store.canSubmit(assessment);
		var status = unanswered ? 'incomplete' : 'complete';
		var busy = Store.getBusyState(assessment);
		var error = Store.getError(assessment);

		busy = (busy === Constants.BUSY.SUBMITTING || busy === Constants.BUSY.LOADING);

		return (
			<div>
				<div className={'set-submission ' + status}>
					{!error ? null : (
						<div className="error">
							<a href="#" onClick={this._dismissAssessmentError}>x</a>{error}
						</div>
					)}
					<a href={disabled?'#':null} className={'button ' + (disabled?'disabled':'')} onClick={this.onSubmit}>{_t('submit')}</a>
					{cannotReset? null: (<a href="#" className="reset button link" onClick={this.onReset}>{_t('reset')}</a>)}
					<span className="status-line">{_t('x_unanswered', { count: unanswered  })}</span>
				</div>

				{!busy ? null : <Loading message="Please Wait" maskScreen={true}/>}
			</div>
		);
	}
});
