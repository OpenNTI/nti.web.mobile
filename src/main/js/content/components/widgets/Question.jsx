import React from 'react';

import Logger from 'nti-util-logger';

import StoreEvents from 'common/mixins/StoreEvents';

import QuestionWidget from 'assessment/components/Question';
import PollWidget from 'assessment/components/Poll';

import Store from 'assessment/Store';
import {SYNC} from 'assessment/Constants';

import Mixin from './Mixin';

const logger = Logger.get('assessment:NAQuestionWidget');

export default React.createClass({
	displayName: 'NAQuestion',
	mixins: [Mixin, StoreEvents],

	backingStore: Store,
	backingStoreEventHandlers: {
		[SYNC]: 'synchronizeFromStore'
	},

	statics: {
		itemType: /na(question|poll)/i
	},


	propTypes: {
		//Normal Path:
		item: React.PropTypes.object,
		page: React.PropTypes.object,

		//Static Rendering Path:
		record: React.PropTypes.object
	},


	getInitialState () {
		return {
			question: null
		};
	},


	componentWillMount () { this.synchronizeFromStore(); },
	componentWillReceiveProps () { this.synchronizeFromStore();	},


	synchronizeFromStore () {
		const {item, page, record} = this.props;

		let question = record;

		if (!question) {
			question = Store.getAssessmentQuestion(item.ntiid);
			if (!question) {
				question = page.getAssessmentQuestion(item.ntiid);
				if (question && !question.individual) {
					logger.error('A Question was found in PageInfo but not in Store and it declares that its not standalone!!!');
					question = null;
				}
			}
		}

		this.setState({ question });
	},


	render () {
		const {props: {item}, state: {question}} = this;

		if (!question) {
			return (
				<span className="question-not-found" data-question-id={item && item.ntiid}/>
			);
		}

		const Widget = question.isPoll ? PollWidget : QuestionWidget;

		return  (
			<Widget question={question}/>
		);
	}
});
