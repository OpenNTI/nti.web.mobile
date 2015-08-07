import React from 'react';
import cx from 'classnames';

import StoreEvents from 'common/mixins/StoreEvents';

import Question from './Question';

import Store from '../Store';


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
		let {question} = this.props;

		let submitted = Store.isSubmitted(question);


		return (
			<div className={cx('poll-wrapper', {'submitted': submitted})}>
				<Question {...this.props}/>

			</div>
		);
	}
});
