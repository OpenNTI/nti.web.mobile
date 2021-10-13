import './Lesson.scss';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { DateTime } from '@nti/web-commons';
import ObjectLink from 'internal/common/mixins/ObjectLink';

export default createReactClass({
	displayName: 'CourseOutlineContentNode',
	mixins: [ObjectLink],

	statics: {
		handles(item) {
			return /courseoutline(content|calendar)node/i.test(item.MimeType);
		},
	},

	propTypes: {
		item: PropTypes.any.isRequired,
		dateFormat: PropTypes.string,
	},

	getDefaultProps() {
		return {
			dateFormat: DateTime.WEEKDAY_MONTH_NAME_DAY,
		};
	},

	render() {
		let { item } = this.props;
		if (!item) {
			return null;
		}

		let href = this.objectLink(item);

		return (
			<div className="outline-node">
				<a href={href}>
					<div className="path">Lessons</div>
					<div className="card-title">{item.title}</div>
					<div className="footer">
						<DateTime
							date={item.getAvailableBeginning()}
							format={this.props.dateFormat}
						/>
					</div>
				</a>
			</div>
		);
	},
});
