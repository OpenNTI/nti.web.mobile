import React from 'react';

export default React.createClass({
	displayName: 'Example',

	render () {

		return (
			<div className="grid-container">
				<hr/>
				<div className="row">
					<div className="small-10 small-centered columns">
						<div className="sadface">:)</div>
						<h2>Hi!</h2>
						<p>This is an exaple widget.</p>
					</div>
				</div>
			</div>
		);
	}
});
