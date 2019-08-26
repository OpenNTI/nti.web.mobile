import React from 'react';

import Registry from '../Registry';

const handles = (obj) => obj && obj.isNote;

export default
@Registry.register(handles)
class NTIMobileCommunityTopic extends React.Component {
	render () {
		return (
			<div>
				Mobile Note
			</div>
		);
	}
}