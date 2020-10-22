import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Logger from '@nti/util-logger';
import { equals } from '@nti/lib-commons';
import {StoreEventsMixin} from '@nti/lib-store';

import QuestionWidget from 'assessment/components/Question';
import PollWidget from 'assessment/components/Poll';
import Store from 'assessment/Store';
import {SYNC, ASSIGNMENT_RESET} from 'assessment/Constants';

import Mixin from './Mixin';

const logger = Logger.get('assessment:NAQuestionWidget');

export default createReactClass({
	displayName: 'NAQuestion',
	mixins: [Mixin, StoreEventsMixin],

	backingStore: Store,
	backingStoreEventHandlers: {
		[SYNC]: 'synchronizeFromStore',
		[ASSIGNMENT_RESET]: 'synchronizeFromStore'
	},

	statics: {
		itemType: /na(question|poll)/i
	},


	propTypes: {
		//Normal Path:
		item: PropTypes.object,
		page: PropTypes.object,

		perspective: PropTypes.string,

		//Static Rendering Path:
		record: PropTypes.object,
		inContext: PropTypes.bool
	},


	getInitialState () {
		return {
			question: this.props.record
		};
	},


	componentDidMount () { this.synchronizeFromStore(); },

	componentDidUpdate (prevProps, prevState) {
		if (!equals(this.props, prevProps)) {
			this.synchronizeFromStore();
		}
	},


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
		const {props: {item, perspective, inContext}, state: {question}} = this;

		if (!question) {
			return (
				<span className="question-not-found" data-question-id={item && item.ntiid}/>
			);
		}

		const Widget = question.isPoll ? PollWidget : QuestionWidget;

		return  (
			<Widget question={question} inContext={inContext} number={item.number} perspective={perspective} />
		);
	}
});
