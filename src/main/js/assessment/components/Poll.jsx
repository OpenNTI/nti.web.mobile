import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import createReactClass from 'create-react-class';
import {SURVEY_REPORT_LINK} from 'nti-lib-interfaces';
import {StoreEventsMixin} from 'nti-lib-store';

import Store from '../Store';
import {toggleAggregatedView} from '../Actions';

import Question from './Question';
import Aggregated from './aggregated/Aggregated';


export default createReactClass({
	displayName: 'Poll',
	mixins: [StoreEventsMixin],

	propTypes: {
		question: PropTypes.object //Poll model
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
		const report = question.getLink(SURVEY_REPORT_LINK);
		const showReport = report && question.individual;
		const showLinks = question.hasAggregationData || showReport;

		return (
			<div className={cx('poll-wrapper', {submitted})}>
				{showAggregation ? (
					<Aggregated {...props}/>
				) : (
					<Question {...props}/>
				)}
				{showLinks && (
					<div className={cx('links', {'showing-results': showAggregation, 'individual': question.individual})}>
						{question.hasAggregationData && ( <a href="#" onClick={this.toggleAggregatedView}>{results}</a> )}
						{showReport && (
							<a href={report} target="_blank" rel="noopener noreferrer">
								<span className="icon-report"/>View Report
							</a>
						)}
					</div>
				)}
			</div>
		);
	}
});
