'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'TimedPlaceholder',


	propTypes: {
		assignment: React.PropTypes.object
	},


	onStart (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		//Temp:
		history.go(-1);
	},


	render () {
		//You have <strong>5 minutes</strong> to complete this Timed Assignment.
		//<span className="red">Once you've started, the timer will not stop.</span>
		var {assignment} = this.props;

		var message = "Timed assignments are currently not supported on the mobile app.";
		var buttonLabel = "Back";//Start

		return (
			<div className="timed-placeholder">
				<div className="header">{assignment.title}</div>
				<div className="fake-questions">

					<div className="question">
						<div className="prompt">
							<div className="line"/>
						</div>
						<div className="answer-container">
							<div className="answers">
								<div className="answer"/>
								<div className="answer"/>
							</div>
						</div>
					</div>

					<div className="question">
						<div className="prompt">
							<div className="line"/>
							<div className="line"/>
							<div className="line long"/>
						</div>
						<div className="answer-container">
							<div className="answers">
								<div className="answer"/>
								<div className="answer"/>
								<div className="answer"/>
								<div className="answer"/>
							</div>
						</div>
					</div>

					<div className="question">
						<div className="prompt">
							<div className="line"/>
							<div className="line"/>
						</div>
						<div className="answer-container">
							<div className="answers">
								<div className="answer"/>
								<div className="answer"/>
								<div className="answer"/>
							</div>
						</div>
					</div>

					<div className="question">
						<div className="prompt">
							<div className="line long"/>
							<div className="answer-container">
								<div className="answers">
									<div className="answer"/>
									<div className="answer"/>
								</div>
							</div>
						</div>
					</div>

					<div className="dialog">
						<div className="dialog window">
							<div className="icon"/>
							<div className="content-area">
								<h1>Timed Assignment</h1>
								<p className="message">{message}</p>
							</div>
							<div className="buttons">
								<a href="#" className="button primary start" onClick={this.onStart}>{buttonLabel}</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
