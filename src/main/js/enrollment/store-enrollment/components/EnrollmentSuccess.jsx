import React from 'react/addons';

import PanelButton from 'common/components/PanelButton';
import BasePathAware from 'common/mixins/BasePath';

//import {translate as _t} from 'common/locale';

module.exports = React.createClass({
	displayName: 'EnrollmentSuccess',
	mixins: [BasePathAware],

	propTypes: {
		courseTitle: React.PropTypes.string,
	},

	render: function() {
		var basePath = this.getBasePath();
		return (
			<div className="small-12 columns">
				<PanelButton href={basePath + 'library/courses/'} linkText="Go to my courses">
					You are now enrolled in {this.props.courseTitle}.
				</PanelButton>
			</div>
		);
	}
});
