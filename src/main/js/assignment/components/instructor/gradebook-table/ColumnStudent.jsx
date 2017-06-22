import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import StudentLink from './StudentLink';
import StudentStatics from './StudentStaticsMixin';

export default createReactClass({
	displayName: 'GradebookColumnStudent',

	mixins: [StudentStatics],

	propTypes: {
		item: PropTypes.object.isRequired // UserGradeBookSummary object
	},

	render () {
		return <StudentLink item={this.props.item}/>;
	}
});
