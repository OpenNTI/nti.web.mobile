import './Placeholder.scss';
import PropTypes from 'prop-types';

Placeholder.propTypes = {
	assignment: PropTypes.object,
	message: PropTypes.string.isRequired,
	buttonLabel: PropTypes.string,
	className: PropTypes.string,
	pageTitle: PropTypes.string.isRequired,
	onConfirm: PropTypes.func,
};

Placeholder.defaultProps = {
	buttonLabel: 'Back',
	className: '',
	onConfirm: () => {},
};

export default function Placeholder({
	assignment,
	message,
	buttonLabel,
	className,
	pageTitle,
	onConfirm,
}) {
	return (
		<div className={'assignment-placeholder ' + className}>
			<div className="header">{assignment.title}</div>
			<div className="fake-questions">
				<div className="question">
					<div className="prompt">
						<div className="line" />
					</div>
					<div className="answer-container">
						<div className="answers">
							<div className="answer" />
							<div className="answer" />
						</div>
					</div>
				</div>

				<div className="question">
					<div className="prompt">
						<div className="line" />
						<div className="line" />
						<div className="line long" />
					</div>
					<div className="answer-container">
						<div className="answers">
							<div className="answer" />
							<div className="answer" />
							<div className="answer" />
							<div className="answer" />
						</div>
					</div>
				</div>

				<div className="question">
					<div className="prompt">
						<div className="line" />
						<div className="line" />
					</div>
					<div className="answer-container">
						<div className="answers">
							<div className="answer" />
							<div className="answer" />
							<div className="answer" />
						</div>
					</div>
				</div>

				<div className="question">
					<div className="prompt">
						<div className="line long" />
						<div className="answer-container">
							<div className="answers">
								<div className="answer" />
								<div className="answer" />
							</div>
						</div>
					</div>
				</div>

				<div className="nti-dialog-mount-point dialog">
					<div className="dialog window">
						<div className="icon" />
						<div className="content-area">
							<h1>{pageTitle}</h1>
							<p className="message">{message}</p>
						</div>
						<div className="buttons">
							<a
								href="#"
								className="button primary start"
								onClick={onConfirm}
							>
								{buttonLabel}
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
