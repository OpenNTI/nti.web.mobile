/** @jsx React.DOM */
'use strict';
var React = require('react/addons');

var Assessment = require('assessment');

module.exports = React.createClass({
	displayName: 'NAQuestion',

	statics: {
		mimeType: /naquestion$/i,
		handles: function(item) {
			var type = item.type || '';
			var cls = item.class || '';
			var re = this.mimeType;
			return re.test(type) || re.test(cls);
		}
	},


	getInitialState: function() {
		return {
			question: null
		};
	},


	componentDidMount: function() {
		var p = this.props;
		var questionId = p.item.ntiid;

		this.setState({
			question: p.pageData.getAssessmentQuestion(questionId)
		});
	},



	render: function() {
		var question = this.state.question;
		if (!question) {return null;}
			
		return (
			<Assessment.QuestionWidget
				contentHints={this.props.item}
				question={question}/>
		);
	}
});
