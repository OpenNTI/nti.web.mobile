import React from 'react';

import BasePathAware from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'NavigationBar',
	mixins: [BasePathAware],

	onMenuTap () {

	},


	render () {
		let [left, right] = this.props.children;

		return (
			<nav className="tab-bar">
				<section className="left-small">{left}</section>

				<section className="middle tab-bar-section">
					<a href={this.getBasePath()} onClick={this.onMenuTap}><h1 className="title">{this.props.title}</h1></a>
				</section>

				<section className="right-small">{right}</section>
			</nav>
		);
	}
});
