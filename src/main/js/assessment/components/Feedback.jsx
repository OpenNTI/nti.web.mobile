import React from 'react';
import {submitFeedback, deleteFeedbackItem, updateFeedbackItem} from '../Api';
import Store from '../Store';
import {scoped} from 'common/locale';
import StoreEvents from 'common/mixins/StoreEvents';

import FeedbackList from './FeedbackList';
import FeedbackEntry from './FeedbackEntry';

const t = scoped('ASSESSMENT.ASSIGNMENTS.FEEDBACK');

module.exports = React.createClass({
	displayName: 'Feedback',
	mixins: [StoreEvents],

	propTypes: {
		assessment: React.PropTypes.string
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'synchronizeFromStore'
	},

	componentDidMount () { this.synchronizeFromStore(); },
	componentWillReceiveProps () { this.synchronizeFromStore();	},


	synchronizeFromStore () {
		this.forceUpdate();
	},


	render () {
		let {assessment} = this.props;
		let feedback = Store.getAssignmentFeedback(assessment);

		if (!Store.isSubmitted(assessment) || !feedback) {
			return null;
		}

		return (
			<div className="feedback container">
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
			.then(()=>this.forceUpdate(), error=>console.warn(error.message || error));
	},


	onEditItem (item, newValue) {
		return updateFeedbackItem(this.props.assessment, item, newValue)
			.then(()=>this.forceUpdate(), error=>console.warn(error.message || error));
	},


	onDeleteItem (item) {
		return deleteFeedbackItem(this.props.assessment, item)
			.then(()=>this.forceUpdate(), error=>console.warn(error.message || error));
	}
});
