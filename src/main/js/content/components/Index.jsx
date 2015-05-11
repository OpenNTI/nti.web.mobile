import React from 'react';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

// import Viewer from './Viewer';

export default React.createClass({
	displayName: 'Content:OutlineView',
	mixins: [ContextSender, NavigatableMixin],

	propTypes: {
		contentPackage: React.PropTypes.object.isRequired
	},


	getContext () {
		let {contentPackage} = this.props;
		let {title} = contentPackage;

		let href = this.makeHref('o/');
		let ntiid = contentPackage.getID();

		return Promise.resolve({
			label: title,
			ntiid,
			href
		});
	},


	render () {
		let {contentPackage} = this.props;
		return (
			<div>{contentPackage.title}</div>
		);
	}
});
