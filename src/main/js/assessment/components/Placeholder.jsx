import React from 'react';

export default class extends React.Component {
    static displayName = 'TimedPlaceholder';

    static propTypes = {
		assignment: React.PropTypes.object,
		message: React.PropTypes.string.isRequired,
		buttonLabel: React.PropTypes.string,
		className: React.PropTypes.string,
		pageTitle: React.PropTypes.string.isRequired,
		onConfirm: React.PropTypes.func
	};

    static defaultProps = {
        buttonLabel: 'Back',
        className: '',
        onConfirm: () => {}
    };

    render() {
		let {assignment, message, buttonLabel, className, pageTitle, onConfirm} = this.props;

		return (
			<div className={'assignment-placeholder ' + className}>
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

					<div className="nti-dialog-mount-point dialog">
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
}
