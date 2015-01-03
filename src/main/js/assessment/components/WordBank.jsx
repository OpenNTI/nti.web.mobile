'use strict';

var React = require('react/addons');

var WordEntry = require('./WordBankEntry');

module.exports = React.createClass({
	displayName: 'WordBank',

	render: function() {
		var {data} = this.props;
		if (!data) {
			return null;
		}

		var {entries} = data;
		if (!entries) {
			console.warn('Bad Entries property of WordBanK');
			return null;
		}

		return (
			<div className="wordbank">
				{entries.map(x=>
					<WordEntry key={x.wid} entry={x}/>
				)}
			</div>
		);
	}
});
