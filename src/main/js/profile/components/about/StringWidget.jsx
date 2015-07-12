import React from 'react';
import ModeledContentPanel from 'modeled-content/components/Panel';
import ensureArray from 'nti.lib.interfaces/utils/ensure-array';

export default React.createClass({
	displayName: 'StringWidget',

	propTypes: {
		item: React.PropTypes.string.isRequired
	},

	statics: {
		handles (item) {
			return typeof item === 'string';
		}
	},

	render () {
		return <div className="string-item"><ModeledContentPanel body={ensureArray(this.props.item)}/></div>;
	}
});
