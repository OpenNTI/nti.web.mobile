import PropTypes from 'prop-types';
import React from 'react';
import Tabs from './Tabs';

export default function AssignmentsPageFrame (props) {
	let Content = props.pageContent;

	return (
		<div className="assignments-page-frame">
			<Tabs />
			<div className="content-area">
				<Content {...props} />
			</div>
		</div>
	);
}

AssignmentsPageFrame.propTypes = {
	pageContent: PropTypes.any.isRequired
};
