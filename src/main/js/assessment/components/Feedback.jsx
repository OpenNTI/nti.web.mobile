import './Feedback.scss';
import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Logger from '@nti/util-logger';
import {scoped} from '@nti/lib-locale';
import {StoreEventsMixin} from '@nti/lib-store';

import {submitFeedback, deleteFeedbackItem, updateFeedbackItem} from '../Api';
import Store from '../Store';

import FeedbackList from './FeedbackList';
import FeedbackEntry from './FeedbackEntry';

const logger = Logger.get('assessment:components:Feedback');
const t = scoped('assessment.assignment.feedback', {
	title: 'Feedback',
	description: 'The comments below will only be visible to you and your instructor.',
});

const logError = error=>logger.warn(error.message || error);

export default createReactClass({
	displayName: 'Feedback',
	mixins: [StoreEventsMixin],

	propTypes: {
		assessment: PropTypes.object
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'synchronizeFromStore'
	},


	getInitialState () {
		return {};
	},


	componentDidMount () { this.synchronizeFromStore(); },
	componentDidUpdate (props) {
		if (props.assessment !== this.props.assessment) {
			this.synchronizeFromStore();
		}
	},


	synchronizeFromStore () {
		const {assessment} = this.props;
		let feedback = Promise.resolve(null);

		if (Store.isSubmitted(assessment)) {
			feedback = Store.getAssignmentFeedback(assessment);
		}

		feedback.then(f => this.setState({feedback: f}));
	},


	render () {
		const {state: {feedback}} = this;

		if (!feedback) {
			return null;
		}

		return (
			<div className="feedback container" name="feedback">
				<div className="feedback header">
					<h3>{t('title')}</h3>
					<div className="message">{t('description')}</div>
				</div>
				<FeedbackList feedback={feedback} onEditItem={this.onEditItem} onDeleteItem={this.onDeleteItem}/>
				<FeedbackEntry feedback={feedback} onSubmit={this.onSubmit}/>
			</div>
		);
	},


	onSubmit (feedbackBody) {
		return submitFeedback(this.props.assessment, feedbackBody)
			.then(()=>this.forceUpdate(), logError);
	},


	onEditItem (item, newValue) {
		return updateFeedbackItem(this.props.assessment, item, newValue)
			.then(()=>this.forceUpdate(), logError);
	},


	onDeleteItem (item) {
		return deleteFeedbackItem(this.props.assessment, item)
			.then(()=>this.forceUpdate(), logError);
	}
});
