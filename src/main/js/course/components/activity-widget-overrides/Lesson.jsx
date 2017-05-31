import React from 'react';

import createReactClass from 'create-react-class';

import {DateTime} from 'nti-web-commons';
import ObjectLink from 'common/mixins/ObjectLink';

export default createReactClass({
	displayName: 'CourseOutlineContentNode',
	mixins: [ObjectLink],

	statics: {
		handles (item) {
			return /courseoutline(content|calendar)node/i.test(item.MimeType);
		}
	},

	propTypes: {
		item: React.PropTypes.any.isRequired,
		dateFormat: React.PropTypes.string
	},

	getDefaultProps () {
		return {
			dateFormat: 'dddd, MMMM D'
		};
	},

	render () {

		let {item} = this.props;
		if (!item) {
			return null;
		}

		let href = this.objectLink(item);

		return (
			<div className="outline-node">
				<a href={href}>
					<div className="path">Lessons</div>
					<div className="card-title">{item.title}</div>
					<div className="footer"><DateTime date={item.getAvailableBeginning()} format={this.props.dateFormat}/></div>
				</a>
			</div>
		);
	}
});
