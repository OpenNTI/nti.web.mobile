import React from 'react';

import t from 'common/locale';

export default React.createClass({
	displayName: 'LocalizedHTML',

	propTypes: {
		stringId: React.PropTypes.string.isRequired,

		tag: React.PropTypes.string,

		className: React.PropTypes.string
	},


	getDefaultProps () {
		return { tag: 'div' };
	},


	render () {
		let Tag = this.props.tag;

		return (
			<Tag {...this.props} dangerouslySetInnerHTML={{__html: t(this.props.stringId, this.props)}} />
		);
	}
});
