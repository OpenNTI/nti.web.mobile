import './Question.scss';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import cx from 'classnames';

import { StoreEventsMixin } from '@nti/lib-store';
import { Mixin as DragDropOrchestrator } from 'internal/common/dnd';

import Store from '../Store';

import Content from './Content';
import QuestionSubmission from './QuestionSubmission';
import WordBank from './WordBank';
import Part from './Part';

const STATUS_MAP = {
	true: 'Correct',
	false: 'Incorrect',
	null: '',
};

export default createReactClass({
	displayName: 'Question',
	mixins: [DragDropOrchestrator, StoreEventsMixin],

	propTypes: {
		question: PropTypes.object.isRequired,
		number: PropTypes.string,
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'synchronizeFromStore',
	},

	synchronizeFromStore() {
		this.forceUpdate();
	},

	childContextTypes: {
		QuestionUniqueDNDToken: PropTypes.object,
	},

	getChildContext() {
		return {
			QuestionUniqueDNDToken: this.state.QuestionUniqueDNDToken,
		};
	},

	getInitialState() {
		return {
			QuestionUniqueDNDToken: this.getNewUniqueToken(),
		};
	},

	componentDidMount() {
		this.maybeSetupSubmission(null, this.props.question);
	},

	componentDidUpdate(prevProps) {
		this.maybeSetupSubmission(prevProps.question, this.props.question);
	},

	maybeSetupSubmission(prev, next) {
		if ((next && next.getID()) !== (prev && prev.getID())) {
			if (prev && prev.individual) {
				Store.teardownAssessment(prev);
			}

			if (next && next.individual) {
				Store.setupAssessment(next, true);
			}
		}
	},

	render() {
		let { question, number } = this.props;

		let admin = Store.isAdministrative(question);
		const isAvailable = Store.isAvailable(question);

		let a = Store.getAssessedQuestion(question, question.getID());
		let parts = question.parts;
		let title = '';

		//correct, incorrect, blank
		let status =
			Store.isSubmitted(question) && a ? STATUS_MAP[a.isCorrect()] : '';

		let css = cx('question', status.toLowerCase(), {
			unavailable: !isAvailable,
			administrative: admin,
			'not-assessed': !a,
		});

		return (
			<div
				className={css}
				data-ntiid={question.getID()}
				type={question.MimeType}
			>
				<h3 className="question-title">
					{number && (
						<span className="question-number">{number}.</span>
					)}
					{title}
					<span className="status">{status}</span>
				</h3>
				<Content
					className="question-content"
					content={question.content}
				/>
				{question.wordbank && (
					<WordBank record={question.wordbank} disabled={admin} />
				)}
				{parts.map((part, i) => (
					<Part
						key={`part-${i}`}
						part={part}
						index={i}
						partCount={parts.length}
						viewerIsAdministrative={admin}
					>
						{this.renderSubmission(i)}
					</Part>
				))}
				{this.renderSubmission()}
			</div>
		);
	},

	renderSubmission(index) {
		let { question } = this.props;
		if (
			!question || //no question
			!question.individual || //the question is part of a set
			(index != null && question.parts.length > 1) || //The index is set, but the question has multiple parts
			(index == null && question.parts.length <= 1) //The index is not set, but the question only has one part, so we rendered already
		) {
			return;
		}

		return <QuestionSubmission question={question} />;
	},
});
