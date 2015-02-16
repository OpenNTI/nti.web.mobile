import React from 'react';

import {IllegalStateException} from 'common/exceptions';

import ErrorWidget from 'common/components/Error';

// This is an exmaple of a widget needing the mixin because it has children,
// only components within this package can(and should) import the mixin this way.
import Mixin from './Mixin';

export default React.createClass({
	displayName: 'CourseOverviewGroup',
	mixins: [Mixin],

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.nticourseoverviewgroup/i,
		handles (item) {
			return this.mimeTest.test(item.MimeType);
		}
	},

	render () {
		let {item} = this.props;

		try {
			return (
				<fieldset className="course-overview-group">
					<legend style={{backgroundColor: `#${item.accentColor}`}}>{item.title}</legend>
					{this._renderItems(item.Items)}
				</fieldset>
			);

		} catch (e) {

			if (!(e instanceof IllegalStateException)) {
				return (<ErrorWidget error={e}/>);
			}
		}

		return null;
	}
});
