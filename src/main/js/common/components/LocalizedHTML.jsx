import React from 'react';

import {scoped} from 'common/locale';

export default React.createClass({
	displayName: 'LocalizedHTML',

	propTypes: {
		stringId: React.PropTypes.string.isRequired,
		scoped: React.PropTypes.string,
		tag: React.PropTypes.string,

		className: React.PropTypes.string
	},


	getDefaultProps () {
		return {
			tag: 'div',
			scoped: ''
		};
	},


	render () {
		let t = scoped(this.props.scoped);
		let Tag = this.props.tag;

		return (
			<Tag {...this.props} dangerouslySetInnerHTML={{__html: t(this.props.stringId, this.props)}} />
		);
	}
});
