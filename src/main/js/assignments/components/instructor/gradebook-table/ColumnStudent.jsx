import React from 'react';

import StudentLink from './StudentLink';
import StudentStatics from './StudentStaticsMixin';

export default React.createClass({
	displayName: 'GradebookColumnStudent',

	mixins: [StudentStatics],

	propTypes: {
		item: React.PropTypes.object.isRequired // UserGradeBookSummary object
	},

	render () {
		return <StudentLink item={this.props.item}/>;
	}
});
