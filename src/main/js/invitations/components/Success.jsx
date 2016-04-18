import React from 'react';

import BasePathAware from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'Invitations:Success',

	mixins: [BasePathAware],

	render () {
		let library = this.getBasePath() + 'library/';
		return (
			<div className="invitation-success">
				<div className="message">
					<p>Success</p>
				</div>
				<div className="button-row">
					<a href={library} className="button">Go to my courses</a>
				</div>
			</div>
		);
	}
});
