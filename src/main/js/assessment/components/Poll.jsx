import React from 'react';
import cx from 'classnames';

import {AGGREGATED_LINK} from 'nti.lib.interfaces/models/assessment/survey/Constants';

import StoreEvents from 'common/mixins/StoreEvents';

import Question from './Question';

import Store from '../Store';
import { getMainSubmittable } from '../Utils';


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


	render () {
		const {props: {question}} = this;
		const submitted = Store.isSubmitted(question);
		const showAggregation = getMainSubmittable(question).hasLink(AGGREGATED_LINK);

		return (
			<div className={cx('poll-wrapper', {'submitted': submitted})}>
				{showAggregation ? (
					<div>Yo!</div>
				) : (
				<Question {...this.props}/>
				)}
			</div>
		);
	}
});
