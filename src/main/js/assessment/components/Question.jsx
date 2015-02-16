'use strict';

var React = require('react');

var {isFlag} = require('common/Utils');
var DragDropOrchestrator = require('common/dnd').Mixin;

var Content = require('./Content');
var WordBank = require('./WordBank');

var Store = require('../Store');
//var Actions = require('../Actions');

var Part = require('./Part');

var STATUS_MAP = {
	'true':'Correct',
	'false': 'Incorrect',
	'null':''
};

module.exports = React.createClass({
	displayName: 'Question',
	mixins: [DragDropOrchestrator],

	propTypes: {
		question: React.PropTypes.object.isRequired
	},


	childContextTypes: {
		QuestionUniqueDNDToken: React.PropTypes.object
	},


	getChildContext: function() {
		return {
			QuestionUniqueDNDToken: this.state.QuestionUniqueDNDToken
		};
	},


	onStoreChange: function () {
		//trigger a reload/redraw
		this.forceUpdate();
	},


	componentDidMount: function() {
		Store.addChangeListener(this.onStoreChange);
	},


	componentWillMount: function() {
		this.setState({
			QuestionUniqueDNDToken: this.getNewUniqueToken()
		});
	},


	componentWillUnmount: function() {
		Store.removeChangeListener(this.onStoreChange);
	},


	render: function() {
		var q = this.props.question;
		var a = Store.getAssessedQuestion(q, q.getID());
		var parts = q.parts;
		var title = '';
		var status = '';//correct, incorrect, blank

		if (Store.isSubmitted(q) && a) {
			status = STATUS_MAP[a.isCorrect()];
		}

		//Ripped from the WebApp:
		if (isFlag('mathcounts-question-number-hack')) {
			//HACK: there should be a more correct way to get the problem name/number...
			title = q.getID().split('.').pop() + '. ';
		}

		return (
			<div className={'question ' + status.toLowerCase()}>
				<h3 className="question-title">
					{title}
					<span className="status">{status}</span>
				</h3>
				<Content className="question-content" content={q.content}/>
				{q.wordbank && (
					<WordBank record={q.wordbank}/>
				)}
				{parts.map((part, i) =>
					<Part key={'part-'+i} part={part} index={i} partCount={parts.length}/>
				)}
				{/* Question Submission will go here, if the question is not part of a set... */}
			</div>
		);
	}
});
