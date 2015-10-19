import React from 'react';

import StoreEvents from 'common/mixins/StoreEvents';

import QuestionWidget from 'assessment/components/Question';
import PollWidget from 'assessment/components/Poll';

import Store from 'assessment/Store';
import {SYNC} from 'assessment/Constants';

import Mixin from './Mixin';

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
		let {item, page, record} = this.props;

		let question = record;

		if (!question) {
			question = page.getAssessmentQuestion(item.ntiid);
		}

		this.setState({ question });
	},


	render () {
		let {question} = this.state;
		if (!question) { return null; }

		let Widget = question.isPoll ? PollWidget : QuestionWidget;

		return  (
			<Widget question={question}/>
		);
	}
});
