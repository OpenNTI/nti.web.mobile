import React from 'react';
import PanelButton from 'common/components/PanelButton';

export default React.createClass({
	displayName: 'DropStore',

	render () {
		return (
			<div className="column">
				<PanelButton linkText="Okay" href="../../">
					Please contact support to drop this course.
				</PanelButton>
			</div>
		);
	}

});
