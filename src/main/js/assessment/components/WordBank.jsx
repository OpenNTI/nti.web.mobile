import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import WordEntry from './WordBankEntry';
import Store from '../Store';

export default class extends React.Component {
    static displayName = 'WordBank';

    static propTypes = {
		record: PropTypes.object.isRequired,
		disabled: PropTypes.bool
	};

    render() {
		let {record, disabled} = this.props;
		if (!record) {
			return null;
		}

		let locked = Store.isSubmitted(record);

		let {entries} = record;
		if (!entries) {
			return null;
		}

		let css = cx({
			'wordbank': true,
			'disabled': disabled
		});

		return (
			<div className={css}>
				{entries.map(x=>
					<WordEntry key={x.wid} entry={x} locked={locked} {...this.getEntryState(x)}/>
				)}
			</div>
		);
	}

    getEntryState = (entry) => {
		let {record} = this.props;
		if (!record.unique) {
			return {};
		}

		return Store.isWordBankEntryUsed(entry) ?
			{className: 'used'} :
			{};
	};
}
