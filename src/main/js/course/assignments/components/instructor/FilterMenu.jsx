import React from 'react';

import SelectBox from 'common/components/SelectBox';

import {setFilter} from '../../GradebookActions';
import Store from '../../GradebookStore';

const OPTIONS = [
	{label: 'Open Students', value: 'Open'},
	{label: 'Enrolled Students', value: 'ForCredit'}
];

export default React.createClass({
	displayName: 'FilterMenu',

	setFilter (value) {
		setFilter(value);
	},

	render () {
		return (
			<SelectBox className="filter-menu" options={OPTIONS} value={Store.filter} onChange={this.setFilter} />
		);
	}
});
