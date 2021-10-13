import './HeaderSurvey.scss';
import PropTypes from 'prop-types';
import cx from 'classnames';
import createReactClass from 'create-react-class';

import { SURVEY_REPORT_LINK } from '@nti/lib-interfaces';
import { StoreEventsMixin } from '@nti/lib-store';
import { Launch } from '@nti/web-reports';

import Store from '../Store';
import { toggleAggregatedView } from '../Actions';

export default createReactClass({
	displayName: 'HeaderSurvey',
	mixins: [StoreEventsMixin],

	propTypes: {
		assessment: PropTypes.object,
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'synchronizeFromStore',
	},

	synchronizeFromStore() {
		this.forceUpdate();
	},

	toggleAggregatedView(e) {
		e.preventDefault();
		e.stopPropagation();
		toggleAggregatedView(this.props.assessment);
	},

	render() {
		let survey = this.props.assessment;
		const report = survey.getLink(SURVEY_REPORT_LINK);
		const submitted = Store.isSubmitted(survey);
		const show = submitted || report || survey.hasAggregationData;

		if (!show) {
			return null;
		}

		const classNames = cx('header assessment common survey', { submitted });

		const results = Store.aggregationViewState(survey)
			? 'Hide Results'
			: 'Show Results';

		return (
			<div className={classNames}>
				<div className="meta">
					{!submitted && <h4>{survey.title}</h4>}
					{submitted && (
						<div>
							<h4>Thank you!</h4>
							{/*<h6>...some thankfull sounding words here...</h6>*/}
						</div>
					)}
				</div>
				{(!!report || survey.hasAggregationData) && (
					<div className="links">
						{survey.hasAggregationData && (
							<a href="#" onClick={this.toggleAggregatedView}>
								{results}
							</a>
						)}
						<Launch.Link context={survey} />
					</div>
				)}
			</div>
		);
	},
});
