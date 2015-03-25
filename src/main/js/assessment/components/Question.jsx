import React from 'react';
import cx from 'classnames';

import {isFlag} from 'common/utils';
import {Mixin as DragDropOrchestrator} from 'common/dnd';

import Content from './Content';
import WordBank from './WordBank';

import Store from '../Store';
//import Actions from '../Actions';

import Part from './Part';

const STATUS_MAP = {
	'true':'Correct',
	'false': 'Incorrect',
	'null':''
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


	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
	},


	componentWillMount () {
		this.setState({
			QuestionUniqueDNDToken: this.getNewUniqueToken()
		});
	},


	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
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

		let css = cx({
			question: true,
			administrative: admin,
			[status.toLowerCase()]: true
		});

		return (
			<div className={css}>
				<h3 className="question-title">
					{title}
					<span className="status">{status}</span>
				</h3>
				<Content className="question-content" content={question.content}/>
				{question.wordbank && (
					<WordBank record={question.wordbank} disabled={admin}/>
				)}
				{parts.map((part, i) =>
					<Part key={'part-'+i} part={part} index={i} partCount={parts.length} viewerIsAdministrative={admin}/>
				)}
				{/* Question Submission will go here, if the question is not part of a set... */}
			</div>
		);
	}
});
