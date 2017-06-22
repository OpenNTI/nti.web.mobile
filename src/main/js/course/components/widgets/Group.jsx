import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Error as ErrorWidget} from 'nti-web-commons';

// This is an exmaple of a widget needing the mixin because it has children,
// only components within this package can(and should) import the mixin this way.
import Mixin, {IllegalStateException} from './Mixin';

export default createReactClass({
	displayName: 'CourseOverviewGroup',
	mixins: [Mixin],

	propTypes: {
		item: PropTypes.shape({
			accentColor: PropTypes.string,
			Items: PropTypes.arrayOf(PropTypes.object)
		}).isRequired
	},

	statics: {
		mimeTest: /nticourseoverviewgroup/i,
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
					{this.renderItems(item.Items)}
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
