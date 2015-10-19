import React from 'react';
import DateTime from 'common/components/DateTime';

import ObjectLink from './ObjectLink';
import Mixin from './Mixin';

export default React.createClass({
	displayName: 'CourseOutlineContentNode',
	mixins: [Mixin, ObjectLink],

	statics: {
		mimeType: /courseoutlinecontentnode|courseoutlinecalendarnode/i
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
