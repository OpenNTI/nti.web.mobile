'use strict';

var React = require('react');

module.exports = React.createClass({
	displayName: 'TimedPlaceholder',


	propTypes: {
		assignment: React.PropTypes.object,
		message: React.PropTypes.string.isRequired,
		buttonLabel: React.PropTypes.string,
		className: React.PropTypes.string,
		pageTitle: React.PropTypes.string.isRequired,
		onConfirm: React.PropTypes.func
	},


	getDefaultProps () {
		return {
			buttonLabel: 'Back',
			className: '',
			onConfirm: () => {}
		};
	},


	render () {
		var {assignment, message, buttonLabel, className, pageTitle, onConfirm} = this.props;


		return (
			<div className={"assignment-placeholder " + className}>
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
								<h1>{pageTitle}</h1>
								<p className="message">{message}</p>
							</div>
							<div className="buttons">
								<a href="#" className="button primary start" onClick={onConfirm}>{buttonLabel}</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
