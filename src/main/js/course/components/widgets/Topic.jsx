import path from 'path';
import React from 'react/addons';

import {encodeForURI} from 'dataserverinterface/utils/ntiids';

import NavigatableMixin from 'common/mixins/NavigatableMixin';

export default React.createClass({
	displayName: 'CourseOverviewTopic',
	mixins: [NavigatableMixin],

	statics: {
		mimeTest: /topic$/i,
		handles (item) {
			return this.mimeTest.test(item.MimeType);
		}
	},


	render () {
		let {props} = this;
		let {item} = props;

		var link = path.join('c', encodeForURI(item.NTIID)) + '/';

		link = this.makeHref(link, true);

		return (
			<div>
				<a href={link}>{item.label}</a>
			</div>
		);
	}
});
