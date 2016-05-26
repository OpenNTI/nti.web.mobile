import React from 'react';
import Logger from 'nti-util-logger';

import {rawContent} from 'nti-commons/lib/jsx';
import {LoadingInline as Loading} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';
import {Mixins} from 'nti-web-commons';

const logger = Logger.get('enrollment:components:enrollment-option-widgets:FiveMinuteEnrollment');
const t = scoped('ENROLLMENT');

const DETAILS = 'fmaep.course.details';

export default React.createClass({
	displayName: 'FiveMinuteEnrollment',

	mixins: [Mixins.BasePath],

	propTypes: {
		entryId: React.PropTypes.string.isRequired,

		// catalogEntry is only used by this component to check EndDate to see if the course is archived. We shouldn't
		// have to do this because available/enabled should be false. We're awaiting a server change for that.
		catalogEntry: React.PropTypes.object.isRequired,

		enrollmentOption: React.PropTypes.object.isRequired //Model with a 'fetchLink' method
	},

	statics: {
		re: /fiveminuteenrollmentoption/i, //The server sends lower case M, but we're comparing case-insensitively.
		handles (option) {
			return this.re.test(option && option.MimeType);
		}
	},


	getInitialState () {
		return {
			loading: true
		};
	},


	componentDidMount () {
		this.updateDetails(this.props);
	},


	componentWillReceiveProps (props) {
		this.updateDetails(props);
	},


	updateDetails (props) {
		if (isArchived(props.catalogEntry)) {
			return this.setState({
				archived: true
			});
		}
		let {enrollmentOption} = props;
		this.setState({loading: true, enrolled: enrollmentOption.enrolled});

		enrollmentOption.fetchLink(DETAILS)
			.then(o=> {
				let {ContactInformation, Course} = o;
				this.setState({loading: false, ContactInformation, Course});
			})
			.catch(error=> this.setState({loading: false, error}));
	},


	registered () {
		return (
			<div>
				<div className="enrollment-status">
					<div className="status">
						<span className="registered">You are enrolled.</span>
					</div>
				</div>
				{this.howToDrop()}
			</div>
		);
	},

	howToDrop () {
		const dropHead = t('howToDropHead', {fallback: 'How do I drop?'});
		const dropBody = t('howToDropBody', {fallback: ''});
		if(dropBody.length > 0) {
			return (
				<div className="how-to-drop">
					<div className="title">{dropHead}</div>
					<div className="info" {...rawContent(dropBody)}/>
				</div>
			);
		}
		return null;
	},

	render () {
		let {entryId} = this.props;
		let {error, loading, archived, Course, enrolled} = this.state;
		let href = this.getBasePath() + 'catalog/enroll/apply/' + entryId + '/';
		let count = Course && Course.SeatAvailable;

		if (archived) {
			logger.debug('Omitting five minute enrollment option; course is archived.');
			return null;
		}

		if (loading) {
			return ( <Loading/> );
		}

		const actions = error ? null : <div className="actions"><a href={href}>{t('fiveMinuteEnrollmentButton')}</a></div>;

		return (
			<div>
				<div className="enrollment five-minute">
					<h2 className="title">{t('fiveMinuteEnrollmentTitle')}</h2>
					<p className="description">{t('fiveMinuteEnrollmentDescription')}</p>
					{error ? (
						<small className="error">{error.Message}</small>
					) : count < 10 ? (
						<small>{t('fiveMinuteEnrollmentSeatAvailable', {count})}</small>
					) :
						null
					}
					{enrolled ? this.registered() : actions}
				</div>
			</div>
		);
	}

});

function isArchived (catalogEntry) {
	return new Date(catalogEntry.EndDate) < Date.now();
}
