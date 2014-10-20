/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var DateTime = require('common/components/DateTime');

var getService = require('common/Utils').getService;

var SUBMITTED_QUIZ = 'application/vnd.nextthought.assessment.assessedquestionset';

module.exports = React.createClass( {
	displayName: 'CourseOverviewDiscussion',

	statics: {
		mimeTest: /(naquestionset|naquestionbank|assignment)$/i,
		handles: function(item) {
			return this.mimeTest.test(item.MimeType);
		}
	},


	componentDidMount: function() {
		getService().then(this.fillInData);
	},


	fillInData: function(service) {

		function getLastQuizSubmission(pageInfo) {
			return pageInfo.getUserDataLastOfType(SUBMITTED_QUIZ)
				.then(function(q) {
					debugger;
				});
		}


		service.getPageInfo(this.props.item['Target-NTIID'])
			.then(getLastQuizSubmission.bind(this))
			.catch(function() {
				//mark as not started
			});
	},

	render: function() {
		var item = this.props.item;
		var questionCount = item["question-count"];
		var label = item.label;
		var completed = false;
		var isLate = false;
		var chart, tally;
		var addClass = (completed ? " completed" : "") + (isLate ? " late" : "");

		/* TODO Get Assignment due date to display.
			Replace placeholder assessement chart icon
			Get result of assessment (x correct, y incorrect)
			*/


		if (this.props.type == "Self-Assessments") {
			addClass += " assessment";
			chart = (<div className="icon assessmentScore"><Chart /></div>);
			tally = (
				<div className="tally">
					<div className="stat correct">
						<span className="count">x</span> correct </div>
					<div className="stat incorrect">
						<span className="count">y</span> incorrect </div>
					<div className="stat questions">{item["question-count"] + " questions"} </div>
				</div>
			);
		}
		else if (this.props.type == "Assignments") {
			addClass += " assignment";
			chart = (<div className={'assignment icon'}></div>);
			tally = (
				<div className="tally">
					<div className='stat due-date late'>Due <DateTime/></div>
					<div className='stat due-date'>Due <DateTime/></div>
				</div>
			);
		}

		return (
			<div className={'overview-naquestionset' + addClass}>
				<div className={'body'}>
					{chart}
					<div className={'tally-box'}>
						<div className={'message'}>{label}</div>
						{tally}
					</div>
				</div>
			</div>
		);

	}
});


// Placeholder chart.
var Chart = React.createClass({
	render: function() {
		return(
			<svg xmlns='http://www.w3.org/2000/svg' version="1.1" width="50" height="50">
				<path stroke-width="2" fill="#d9d9d9" stroke-opacity="1" stroke="#fff" d="M0,25 A25,25 0 0,1 50,25 A25,25 0 0,1 0,25"></path>
				<path stroke-width="2" fill="#fff" stroke-opacity="1" stroke="#fff" d="M7,25 A18,18 0 0,1 43,25 A18,18 0 0,1 7,25"></path>
				<text fill="#d9d9d9" x="11" y="30">xx%</text>
			</svg>
		);
	}
});
