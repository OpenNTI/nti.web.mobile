import React from 'react/addons';

import QuestionWidget from 'assessment/components/Question';

export default React.createClass({
	displayName: 'NAQuestion',

	statics: {
		mimeType: /naquestion/i,
		handles (item) {
			var type = item.type || '';
			var cls = item.class || '';
			var re = this.mimeType;
			return re.test(type) || re.test(cls);
		}
	},


	getInitialState () {
		return {
			question: null
		};
	},


	componentDidMount () {
		var p = this.props;
		var questionId = p.item.ntiid;

		this.setState({
			question: p.page.getAssessmentQuestion(questionId)
		});
	},



	render () {
		var {question} = this.state;
		if (!question) {return null;}

		return (
			<QuestionWidget
				contentHints={this.props.item}
				question={question}/>
		);
	}
});
