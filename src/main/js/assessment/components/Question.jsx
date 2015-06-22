import React from 'react';
import cx from 'classnames';

import {isFlag} from 'common/utils';
import {Mixin as DragDropOrchestrator} from 'common/dnd';

import Content from './Content';
import QuestionSubmission from './QuestionSubmission';
import WordBank from './WordBank';

import Store from '../Store';

import Part from './Part';

const STATUS_MAP = {
	'true': 'Correct',
	'false': 'Incorrect',
	'null': ''
};

export default React.createClass({
	displayName: 'Question',
	mixins: [DragDropOrchestrator],

	propTypes: {
		question: React.PropTypes.object.isRequired
	},


	childContextTypes: {
		QuestionUniqueDNDToken: React.PropTypes.object
	},


	getChildContext () {
		return {
			QuestionUniqueDNDToken: this.state.QuestionUniqueDNDToken
		};
	},


	onStoreChange () {
		//trigger a reload/redraw
		this.forceUpdate();
	},



	componentWillMount () {
		this.setState({
			QuestionUniqueDNDToken: this.getNewUniqueToken()
		});
	},


	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
		this.maybeSetupSubmission(null, this.props.question);
	},


	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
	},


	componentWillReceiveProps (nextProps) {
		this.maybeSetupSubmission(this.props.question, nextProps.question);
	},


	maybeSetupSubmission (prev, next) {

		if ((next && next.getID()) !== (prev && prev.getID())) {
			if (prev && prev.individual) {
				Store.teardownAssessment(prev);
			}

			if (next && next.individual) {
				Store.setupAssessment(next);
			}
		}
	},



	render () {
		let {question} = this.props;
		let admin = Store.isAdministrative(question);
		let a = Store.getAssessedQuestion(question, question.getID());
		let parts = question.parts;
		let title = '';

		//correct, incorrect, blank
		let status = (Store.isSubmitted(question) && a) ?
			STATUS_MAP[a.isCorrect()] : '';

		//Ripped from the WebApp:
		if (isFlag('mathcounts-question-number-hack')) {
			//HACK: there should be a more correct way to get the problem name/number...
			title = question.getID().split('.').pop() + '. ';
		}

		let css = cx('question', status.toLowerCase(), {
			administrative: admin
		});

		return (
			<div className={css} data-ntiid={question.getID()} type={question.MimeType}>
				<h3 className="question-title">
					{title}
					<span className="status">{status}</span>
				</h3>
				<Content className="question-content" content={question.content}/>
				{question.wordbank && (
					<WordBank record={question.wordbank} disabled={admin}/>
				)}
				{parts.map((part, i) =>
					<Part key={`part-${i}`} part={part} index={i} partCount={parts.length} viewerIsAdministrative={admin}>
						{this.renderSubmission(i)}
					</Part>
				)}
				{this.renderSubmission()}
			</div>
		);
	},


	renderSubmission (index) {
		let {question} = this.props;
		if (!question || //no question
			!question.individual || //the question is part of a set
			(index != null && question.parts.length > 1) || //The index is set, but the question has multiple parts
			(index == null && question.parts.length <= 1) //The index is not set, but the question only has one part, so we rendered already
		) {
			return;
		}

		return (
			<QuestionSubmission question={question}/>
		);
	}
});
