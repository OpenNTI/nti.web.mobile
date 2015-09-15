import React from 'react';

import Loading from 'common/components/LoadingInline';
import PanelButton from 'common/components/PanelButton';

import {scoped} from 'common/locale';

import BasePathAware from 'common/mixins/BasePath';

const t = scoped('ENROLLMENT');

const DETAILS = 'fmaep.course.details';

export default React.createClass({
	displayName: 'FiveMinuteEnrollment',

	mixins: [BasePathAware],

	propTypes: {
		entryId: React.PropTypes.string.isRequired,

		// catalogEntry is only used by this component to check EndDate to see if the course is archived. We shouldn't
		// have to do this because available/enabled should be false. We're awaiting a server change for that.
		catalogEntry: React.PropTypes.object.isRequired
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
		this.setState({loading: true});

		enrollmentOption.fetchLink(DETAILS)
			.then(o=> {
				let {ContactInformation, Course} = o;
				this.setState({loading: false, ContactInformation, Course});
			})
			.catch(error=> this.setState({loading: false, error}));
	},


	render () {
		let {entryId} = this.props;
		let {error, loading, archived, Course} = this.state;
		let href = this.getBasePath() + 'catalog/enroll/apply/' + entryId + '/';
		let count = Course && Course.SeatAvailable;

		if (archived) {
			console.info('Omitting five minute enrollment option; course is archived.');
			return null;
		}

		let props = {
			href,
			linkText: t('fiveMinuteEnrollmentButton')
		};

		if (loading) {
			return ( <Loading/> );
		}

		if (error) {
			props.button = (<div/>);
		}

		return (
			<PanelButton {...props}>
				<h2>{t('fiveMinuteEnrollmentTitle')}</h2>
				<p>{t('fiveMinuteEnrollmentDescription')}</p>

				{error ? (
					<small className="error">{error.Message}</small>
				) : count < 10 ? (
					<small>{t('fiveMinuteEnrollmentSeatAvailable', {count})}</small>
				) :
					null
				}
			</PanelButton>
		);
	}

});

function isArchived (catalogEntry) {
	return new Date(catalogEntry.EndDate) < Date.now();
}
