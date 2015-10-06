import React from 'react';
import cx from 'classnames';

import {AGGREGATED_LINK, REPORT_LINK} from 'nti.lib.interfaces/models/assessment/survey/Constants';
import {HISTORY_LINK} from 'nti.lib.interfaces/models/assessment/Constants';

import If from 'common/components/Conditional';
import StoreEvents from 'common/mixins/StoreEvents';

import Store from '../Store';

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


	render () {
		let survey = this.props.assessment;
		const report = survey.getLink(REPORT_LINK);
		const submitted = survey.hasLink(HISTORY_LINK);
		const show = submitted || survey.hasLink(AGGREGATED_LINK) || report;

		if (!show) {
			return null;
		}

		const classNames = cx('header assessment survey', {submitted});

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
					<a href={report} target="_blank"><span className="icon-report"/>View Report</a>
				</If>
			</div>
		);
	}
});
