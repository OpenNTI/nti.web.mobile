'use strict';

var React = require('react');

var WordEntry = require('./WordBankEntry');

var Store = require('../Store');

module.exports = React.createClass({
	displayName: 'WordBank',

	propTypes: {
		record: React.PropTypes.object.isRequired
	},


	render () {
		var {record} = this.props;
		if (!record) {
			return null;
		}

		var locked = Store.isSubmitted(record);

		var {entries} = record;
		if (!entries) {
			console.warn('Bad Entries property from WordBank record');
			return null;
		}

		return (
			<div className="wordbank">
				{entries.map(x=>
					<WordEntry key={x.wid} entry={x} locked={locked} {...this.getEntryState(x)}/>
				)}
			</div>
		);
	},

	getEntryState (entry) {
		var {record} = this.props;
		if (!record.unique) {
			return {};
		}

		return Store.isWordBankEntryUsed(entry) ?
			{className:"used"} :
			{};
	}
});
