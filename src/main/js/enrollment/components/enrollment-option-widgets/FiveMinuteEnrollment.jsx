import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Logger from 'nti-util-logger';
import {rawContent} from 'nti-commons';
import {scoped} from 'nti-lib-locale';
import {Loading, Mixins} from 'nti-web-commons';

const logger = Logger.get('enrollment:components:enrollment-option-widgets:FiveMinuteEnrollment');
const t = scoped('enrollment.fiveMinuteEnrollment', {
	title: 'Enroll for Credit',
	description: 'Earn transcripted college credit from the University of Oklahoma.',
	button: 'Enroll for Credit',
	howToDropHead: 'How do I drop?',
	howToDropBody: '',
	SeatsAvailable: {
		zero: 'No Seats Remaining',
		one: '%(count)s Seat Available',
		other: '%(count)s Seats Available'
	},
});

const DETAILS = 'fmaep.course.details';

export default createReactClass({
	displayName: 'FiveMinuteEnrollment',

	mixins: [Mixins.BasePath],

	propTypes: {
		entryId: PropTypes.string.isRequired,

		// catalogEntry is only used by this component to check EndDate to see if the course is archived. We shouldn't
		// have to do this because available/enabled should be false. We're awaiting a server change for that.
		catalogEntry: PropTypes.object.isRequired,

		enrollmentOption: PropTypes.object.isRequired //Model with a 'fetchLink' method
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
		const dropHead = t('howToDropHead');
		const dropBody = t('howToDropBody');
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
			return ( <Loading.Whacky/> );
		}

		const actions = error ? null : <div className="actions"><a href={href}>{t('button')}</a></div>;

		return (
			<div>
				<div className="enrollment five-minute">
					<h2 className="title">{t('title')}</h2>
					<p className="description">{t('description')}</p>
					{error ? (
						<small className="error">{error.Message}</small>
					) : count < 10 ? (
						<small>{t('SeatsAvailable', {count})}</small>
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
