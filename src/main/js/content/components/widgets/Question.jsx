import React from 'react';

import QuestionWidget from 'assessment/components/Question';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'NAQuestion',
	mixins: [Mixin],

	statics: {
		itemType: /naquestion/i
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


	componentWillMount () {
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

		return (
			<QuestionWidget question={question}/>
		);
	}
});
