import React from 'react';
import Button from './Button';

export default React.createClass({
	displayName: 'ButtonFullWidth',

	//Lets use these very sparingly. Full-Width buttons are really ugly in my opinion.

	render () {
		return (
			<Button {...this.props} className="column"/>
		);
	}

});
