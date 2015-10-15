import React from 'react';
import cx from 'classnames';

import {REPORT_LINK} from 'nti.lib.interfaces/models/assessment/survey/Constants';

import If from 'common/components/Conditional';
import StoreEvents from 'common/mixins/StoreEvents';

import Question from './Question';
import Aggregated from './aggregated/Aggregated.async';

import Store from '../Store';
import {toggleAggregatedView} from '../Actions';

export default React.createClass({
	displayName: 'Poll',
	mixins: [StoreEvents],

	propTypes: {
		question: React.PropTypes.object //Poll model
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'synchronizeFromStore'
	},

	synchronizeFromStore () {
		//trigger a reload/redraw
		this.forceUpdate();
	},


	toggleAggregatedView (e) {
		e.preventDefault();
		e.stopPropagation();
		toggleAggregatedView(this.props.question);
	},


	render () {
		const {props} = this;
		const {question} = props;

		const submitted = Store.isSubmitted(question);
		const showAggregation = Store.aggregationViewState(question);
		const results = showAggregation ? 'Hide Results' : 'Show Results';
		const report = question.getLink(REPORT_LINK);
		const showReport = report && question.individual;
		const showLinks = question.hasAggregationData || showReport;

		return (
			<div className={cx('poll-wrapper', {submitted})}>
				{showAggregation ? (
					<Aggregated {...props}/>
				) : (
					<Question {...props}/>
				)}
				<If condition={showLinks} className={cx('links', {'showing-results': showAggregation, 'individual': question.individual})}>
					<If condition={question.hasAggregationData} tag="a" href="#" onClick={this.toggleAggregatedView}>{results}</If>
					<If condition={showReport} tag="a" href={report} target="_blank"><span className="icon-report"/>View Report</If>
				</If>
			</div>
		);
	}
});
