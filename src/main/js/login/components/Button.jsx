import React from 'react';
import {Link} from 'react-router-component';

export default React.createClass({
	displayName: 'login.Button',

	render () {
		return (
			<Link {...this.props} className="tiny button small-12 columns">{this.props.children}</Link>
		);
	}

});
