import React from 'react';
import BasePathAware from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'Page',
	mixins: [BasePathAware],

	render () {
		return (
			<div>
				<a href={this.getBasePath() + 'catalog/'}>Add</a>
				{this.props.children}
			</div>
		);
	}
});
