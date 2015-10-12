import React from 'react';
import cx from 'classnames';

import {REPORT_LINK} from 'nti.lib.interfaces/models/assessment/survey/Constants';

import If from 'common/components/Conditional';
import StoreEvents from 'common/mixins/StoreEvents';

import Store from '../Store';
import {toggleAggregatedView} from '../Actions';

export default React.createClass({
	displayName: 'HeaderSurvey',
	mixins: [StoreEvents],

	propTypes: {
		assessment: React.PropTypes.object
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'synchronizeFromStore'
	},


	// componentWillMount () { this.synchronizeFromStore(); },
	componentWillReceiveProps () { this.synchronizeFromStore(); },


	synchronizeFromStore () {
		this.forceUpdate();
	},


	toggleAggregatedView (e) {
		e.preventDefault();
		e.stopPropagation();
		toggleAggregatedView(this.props.assessment);
	},


	render () {
		let survey = this.props.assessment;
		const report = survey.getLink(REPORT_LINK);
		const submitted = Store.isSubmitted(survey);
		const show = submitted || report;

		if (!show) {
			return null;
		}

		const classNames = cx('header assessment survey', {submitted});

		const results = Store.aggregationViewState(survey) ? 'Hide Results' : 'Show Results';

		return (
			<div className={classNames}>
				<div className="meta">
					<If condition={!submitted} tag="h4">{survey.title}</If>
					<If condition={submitted}>
						<h4>Thank you!</h4>
						{/*<h6>...some thankfull sounding words here...</h6>*/}
					</If>
				</div>
				<If condition={!!report} className="links">
					<a href="#" onClick={this.toggleAggregatedView}>{results}</a>
					<a href={report} target="_blank"><span className="icon-report"/>View Report</a>
				</If>
			</div>
		);
	}
});
