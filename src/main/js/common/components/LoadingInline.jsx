import React from 'react';

export default React.createClass({
	displayName: 'LoadingInline',

	render () {
		return (
			<div className="inline-loader-wrap">
				<ul className="loader">
					<li/><li/><li/>
				</ul>
			</div>
		);
	}

});
