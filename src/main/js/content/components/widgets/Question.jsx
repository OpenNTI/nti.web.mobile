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
		item: React.PropTypes.object
	},


	getInitialState () {
		return {
			question: null
		};
	},


	componentWillMount () {
		let p = this.props;
		let questionId = p.item.ntiid;

		this.setState({
			question: p.page.getAssessmentQuestion(questionId)
		});
	},


	render () {
		let {question} = this.state;
		let {item} = this.props;
		if (!question) { return null; }

		return (
			<QuestionWidget
				contentHints={item}
				question={question}/>
		);
	}
});
