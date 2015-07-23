import React from 'react';
import {Link} from 'react-router-component';

export default React.createClass({
	displayName: 'login.Button',

	render () {
		let {props} = this;
		return (
			<Link {...props} className="tiny button"/>
		);
	}

});
