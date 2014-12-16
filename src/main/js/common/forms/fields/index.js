'use strict';

var StateSelect  = {
	baseConfig: {
		ref: 'state',
		required: true,
		type: 'select',
		optionsLink: {
			type: 'rel',
			rel: 'fmaep.state.names'
		}
	},
	withProps: function(props) {
		return Object.assign({},this.baseConfig,props);
	}
};

var CountrySelect  = {
	baseConfig: {
		ref: 'nation_code',
		required: true,
		type: 'select',
		optionsLink: {
			type: 'rel',
			rel: 'fmaep.country.names'
		}
	},
	withProps: function(props) {
		return Object.assign({}, this.baseConfig, props);
	}
};

module.exports = {
	StateSelect: StateSelect,
	CountrySelect: CountrySelect
};
