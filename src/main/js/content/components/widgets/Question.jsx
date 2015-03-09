import React from 'react';

import QuestionWidget from 'assessment/components/Question';

export default React.createClass({
	displayName: 'NAQuestion',

	statics: {
		mimeType: /naquestion/i,
		handles (item) {
			let type = item.type || '';
			let cls = item.class || '';
			let re = this.mimeType;
			return re.test(type) || re.test(cls);
		}
	},


	getInitialState () {
		return {
			question: null
		};
	},


	componentDidMount () {
		let p = this.props;
		let questionId = p.item.ntiid;

		this.setState({
			question: p.page.getAssessmentQuestion(questionId)
		});
	},



	render () {
		let {question} = this.state;
		let {item} = this.props;
		if (!question) {return null;}

		return (
			<QuestionWidget
				contentHints={item}
				question={question}/>
		);
	}
});
